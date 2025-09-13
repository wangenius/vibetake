"use client";

import { CheckCircle, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APIServer } from "@/lib/axios";

export type PaymentResult = {
  success: boolean;
  error?: string;
  details?: string;
  paymentIntent?: {
    id: string;
    amount: number;
    currency: string;
    status: string;
  };
  subscription?: {
    id: string;
    status: string;
    currentPeriodEnd: number;
  };
};
export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Stripe Checkout success URL now passes `session_id`
    const sessionId = searchParams.get("session_id");

    if (sessionId) {
      verifyPayment(sessionId);
    } else {
      setResult(null);
      setLoading(false);
    }
  }, [searchParams]);

  const verifyPayment = async (sessionId: string) => {
    try {
      const data = await APIServer.post("/payment/status", { sessionId });

      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "验证支付时发生错误",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p className="text-center text-muted-foreground">正在验证支付结果...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <XCircle className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">支付验证失败</h2>
            <p className="text-center text-muted-foreground mb-4">无法获取支付结果，请联系客服。</p>
            <Button asChild>
              <Link href="/">返回首页</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!result.success) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="w-6 h-6" />
              支付失败
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{result.error || "支付过程中发生错误，请重试。"}</p>
            {result.details && (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">{result.details}</p>
            )}
            <div className="flex gap-2">
              <Button variant="outline" asChild className="flex-1">
                <Link href="/">返回首页</Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href="/pricing">重新支付</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-6 h-6" />
            支付成功！
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.paymentIntent && (
            <div className="space-y-2">
              <h3 className="font-medium">支付详情</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>支付ID: {result.paymentIntent.id}</p>
                <p>
                  金额: {(result.paymentIntent.amount / 100).toFixed(2)} {result.paymentIntent.currency.toUpperCase()}
                </p>
                <p>状态: {result.paymentIntent.status}</p>
              </div>
            </div>
          )}

          {result.subscription && (
            <div className="space-y-2">
              <h3 className="font-medium">订阅信息</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>订阅ID: {result.subscription.id}</p>
                <p>状态: {result.subscription.status}</p>
                <p>下次续费: {new Date(result.subscription.currentPeriodEnd * 1000).toLocaleDateString("zh-CN")}</p>
              </div>
            </div>
          )}

          <div className="pt-4">
            <p className="text-sm text-muted-foreground mb-4">感谢您的支付！您的订单已成功处理。</p>
            <div className="flex gap-2">
              <Button variant="outline" asChild className="flex-1">
                <Link href="/dashboard">查看订阅</Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href="/">返回首页</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
