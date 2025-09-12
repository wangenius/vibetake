import { stripe, STRIPE_CONFIG } from "@/services/payment/stripe.config";
import { auth } from "@/services/userauth/auth";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    // 验证用户身份
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      priceId,
      quantity = 1,
      metadata = {},
      successUrl,
      cancelUrl,
    } = await req.json();

    // 验证价格 ID
    if (!priceId) {
      return Response.json({ error: "Price ID is required" }, { status: 400 });
    }

    // 创建或获取 Stripe 客户
    let customer;
    try {
      const customers = await stripe.customers.list({
        email: session.user.email,
        limit: 1,
      });

      if (customers.data.length > 0) {
        customer = customers.data[0];
      } else {
        customer = await stripe.customers.create({
          email: session.user.email,
          name: session.user.name,
          metadata: {
            userId: session.user.id,
          },
        });
      }
    } catch (error) {
      console.error("Error creating/finding customer:", error);
      return Response.json(
        { error: "Customer creation failed" },
        { status: 500 }
      );
    }

    console.log(STRIPE_CONFIG);

    // 处理 URL，确保是绝对 URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const getAbsoluteUrl = (url: string) => {
      if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
      }
      return `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`;
    };

    const finalSuccessUrl = successUrl
      ? `${getAbsoluteUrl(successUrl)}?session_id={CHECKOUT_SESSION_ID}`
      : `${STRIPE_CONFIG.successUrl}?session_id={CHECKOUT_SESSION_ID}`;

    const finalCancelUrl = cancelUrl
      ? getAbsoluteUrl(cancelUrl)
      : STRIPE_CONFIG.cancelUrl;

    // 获取价格信息以确定支付模式
    let price;
    try {
      price = await stripe.prices.retrieve(priceId);
    } catch (error) {
      console.error("Error retrieving price:", error);
      return Response.json({ error: "Invalid price ID" }, { status: 400 });
    }

    // 根据价格类型确定支付模式
    const mode = price.type === "recurring" ? "subscription" : "payment";

    // 根据支付模式确定可用的支付方式
    const paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] =
      mode === "subscription"
        ? ["card"] // 订阅模式只支持信用卡
        : ["card", "alipay", "wechat_pay"]; // 一次性支付支持多种方式

    // 创建支付会话
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode,
      payment_method_types: paymentMethodTypes,
      line_items: [
        {
          price: priceId,
          quantity,
        },
      ],
      success_url: finalSuccessUrl,
      cancel_url: finalCancelUrl,
      metadata: {
        userId: session.user.id,
        ...metadata,
      },
      // 支付方式选项配置
      payment_method_options: {
        wechat_pay: {
          client: "web", // 微信支付需要设置为 web
        },
      },
      // 自动税费
      automatic_tax: { enabled: true },
      // 允许促销码
      allow_promotion_codes: true,
      // 自动更新客户地址信息
      customer_update: {
        address: "auto",
        shipping: "auto",
      },
    });

    return Response.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error("Create checkout session error:", error);
    return Response.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
