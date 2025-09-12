import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/services/payment/stripe.config";
import { auth } from "@/services/userauth/auth";

// 获取用户订阅状态
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email;

    if (!email) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 查找 Stripe 客户
    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (!customers.data.length) {
      return NextResponse.json({ subscription: null });
    }

    // 获取活跃订阅
    const subscriptions = await stripe.subscriptions.list({
      customer: customers.data[0].id,
      status: "active",
      limit: 1,
    });

    if (!subscriptions.data.length) {
      return NextResponse.json({ subscription: null });
    }

    const subscription = subscriptions.data[0].items.data[0];

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error("Get subscription status error:", error);
    return NextResponse.json({ error: "Failed to get subscription status" }, { status: 500 });
  }
}

// 验证支付状态
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 });
    }

    const { paymentIntentId, status } = await request.json();

    if (!paymentIntentId) {
      return NextResponse.json(
        {
          success: false,
          error: "缺少支付意图ID",
          details: "请确保从支付页面正确跳转，并包含必要的支付参数",
        },
        { status: 400 },
      );
    }

    if (!status) {
      return NextResponse.json(
        {
          success: false,
          error: "缺少支付状态参数",
          details: "支付重定向缺少状态信息，请重新发起支付",
        },
        { status: 400 },
      );
    }

    // 从 Stripe 获取支付意图详情
    let paymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      console.error("获取支付意图失败:", error);
      return NextResponse.json(
        {
          success: false,
          error: "无效的支付意图ID",
          details: "无法找到对应的支付记录，请联系客服或重新发起支付",
        },
        { status: 400 },
      );
    }

    if (paymentIntent.status === "succeeded") {
      // 支付成功，检查是否有关联的订阅
      let subscription = null;

      if (paymentIntent.metadata?.subscriptionId) {
        try {
          subscription = await stripe.subscriptions.retrieve(paymentIntent.metadata.subscriptionId);
        } catch (error) {
          console.error("获取订阅信息失败:", error);
        }
      }

      return NextResponse.json({
        success: true,
        paymentIntent: {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
        },
        subscription: subscription
          ? {
              id: subscription.id,
              status: subscription.status,
              currentPeriodEnd: subscription.ended_at,
            }
          : undefined,
      });
    } else {
      // 根据不同的支付状态提供具体的错误信息
      let errorMessage = "支付未完成";
      let errorDetails = "";

      switch (paymentIntent.status) {
        case "requires_payment_method":
          errorMessage = "支付方式无效";
          errorDetails = "请检查您的支付方式是否有效，或尝试使用其他支付方式";
          break;
        case "requires_confirmation":
          errorMessage = "支付需要确认";
          errorDetails = "支付需要进一步确认，请完成支付流程";
          break;
        case "requires_action":
          errorMessage = "支付需要验证";
          errorDetails = "支付需要额外验证（如3D安全验证），请完成验证步骤";
          break;
        case "processing":
          errorMessage = "支付处理中";
          errorDetails = "支付正在处理中，请稍后刷新页面查看结果";
          break;
        case "requires_capture":
          errorMessage = "支付待确认";
          errorDetails = "支付已授权但尚未完成，请联系客服";
          break;
        case "canceled":
          errorMessage = "支付已取消";
          errorDetails = "支付已被取消，如需继续请重新发起支付";
          break;
        default:
          errorMessage = `支付状态异常: ${paymentIntent.status}`;
          errorDetails = "支付状态未知，请联系客服或重新发起支付";
      }

      return NextResponse.json({
        success: false,
        error: errorMessage,
        details: errorDetails,
        paymentIntent: {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
        },
      });
    }
  } catch (error) {
    console.error("验证支付失败:", error);

    // 根据错误类型提供更具体的错误信息
    let errorMessage = "验证支付时发生错误";
    let errorDetails = "请稍后重试，如问题持续存在请联系客服";

    if (error instanceof Error) {
      if (error.message.includes("No such payment_intent")) {
        errorMessage = "支付记录不存在";
        errorDetails = "无法找到对应的支付记录，请确认支付链接是否正确";
      } else if (error.message.includes("rate_limit")) {
        errorMessage = "请求过于频繁";
        errorDetails = "请稍后再试，避免频繁刷新页面";
      } else if (error.message.includes("api_key")) {
        errorMessage = "服务配置错误";
        errorDetails = "支付服务配置异常，请联系技术支持";
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: errorDetails,
      },
      { status: 500 },
    );
  }
}
