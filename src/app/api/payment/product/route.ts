import { stripe } from "@/services/payment/stripe.config";
import { NextRequest, NextResponse } from "next/server";

// 获取所有活跃的产品和价格
export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();
    // 获取所有活跃的产品
    const product = await stripe.products.retrieve(productId);

    // 获取所有活跃的价格
    const prices = await stripe.prices.list({
      product: productId,
    });

  

    return NextResponse.json({
      success: true,
      data: {
        product,
        prices: prices.data,
      },
    });
  } catch (error) {
    console.error("获取Stripe产品失败:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}
