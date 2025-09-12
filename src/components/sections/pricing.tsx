"use client";

import { Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { PRICE_FEATURES, type SubscriptionStatus } from "@/components/sections/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useStripeProducts } from "@/hooks/use-stripe-products";
import { APIServer } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { useSession } from "@/services/userauth/auth-client";

export function PricingSection() {
  const [loading, setLoading] = useState<string | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<SubscriptionStatus | null>(null);
  const [fetchingSubscription, setFetchingSubscription] = useState(false);
  const { data: session, isPending: sessionLoading } = useSession();
  const { product, loading: productsLoading, error: productsError } = useStripeProducts();

  // 获取用户当前订阅状态
  const fetchSubscription = useCallback(async () => {
    if (!session?.user?.id) return;
    setFetchingSubscription(true);
    try {
      const data = await APIServer.get("/payment/status");
      if (data.success) {
        setCurrentSubscription(data.data.subscription);
      }
    } catch (error) {
      console.error("获取订阅状态失败:", error);
    } finally {
      setFetchingSubscription(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchSubscription();
    }
  }, [session?.user?.id, fetchSubscription]);

  // 检查计划是否为当前订阅
  const isCurrentPlan = (priceId: string) => {
    return currentSubscription?.price?.id === priceId;
  };

  // 获取按钮文本
  const getButtonText = (priceId: string) => {
    if (loading === priceId) return "处理中...";
    if (isCurrentPlan(priceId)) return "当前计划";
    if (priceId === "free") return "开始使用";
    return "立即订阅";
  };

  const handleSubscribe = async (priceId: string) => {
    // 检查用户是否已登录
    if (!session?.user?.id) {
      toast.error("请先登录后再订阅");
      // 可以跳转到登录页面
      window.location.href = "/login";
      return;
    }

    // 检查是否为免费计划
    if (priceId === "free") {
      toast.success("免费计划已激活！");
      return;
    }

    console.log("priceId", priceId);
    console.log("currentSubscription", currentSubscription);

    // 检查是否已经是当前计划
    if (currentSubscription?.price?.id === priceId) {
      toast.info("您已经订阅了此计划");
      return;
    }

    setLoading(priceId);
    try {
      const data = await APIServer.post("/payment/create", {
        priceId: priceId,
        successUrl: "/payment/success",
        cancelUrl: "/payment/cancel",
      });

      if (!data.success) {
        throw new Error(data.error || "创建支付会话失败");
      }

      if (data.data?.url) {
        // 跳转到 Stripe 支付页面
        window.location.href = data.data.url;
      } else {
        throw new Error("未获取到支付页面URL");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "创建支付会话失败");
      setLoading(null);
    }
    // 注意：这里不设置 setLoading(null)，因为页面会跳转
  };

  // 格式化价格显示
  const formatPrice = (amount: number | null, currency: string) => {
    if (amount === null || amount === 0) return "Free";
    return `$${(amount / 100).toFixed(0)}`;
  };

  // 获取产品特性列表
  const getPriceFeatures = (priceId: string) => {
    return PRICE_FEATURES[priceId]?.features || [];
  };

  if (productsError) {
    return (
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">加载产品信息失败: {productsError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl sm:text-center">
          <h2 className="text-base font-semibold leading-7 text-muted-foreground">Pricing Plans</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Choose the perfect plan for your needs
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-center">
          vibetake offers flexible pricing options to suit developers and teams of all sizes. Kickstart your modern
          project development.
        </p>
        <div className="mt-20 flow-root">
          {productsLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">加载产品信息中...</span>
            </div>
          ) : (
            <div className="isolate -mt-16 grid max-w-sm grid-cols-1 gap-y-16 gap-x-4 sm:mx-auto lg:-mx-8 lg:mt-0 lg:max-w-none lg:grid-cols-3 xl:-mx-4">
              {Object.entries(PRICE_FEATURES)?.map(([name, features], index) => {
                if (name === "free")
                  return (
                    <Card key={"free"} className={cn("flex flex-col", index === 1 ? "ring-1 ring-primary" : "")}>
                      <CardHeader>
                        <CardTitle id={"free"} className="text-base font-semibold leading-7">
                          {name}
                        </CardTitle>
                        <CardDescription className="mt-6 flex items-baseline gap-x-1">
                          <span className="text-5xl font-bold tracking-tight text-primary">{"Free"}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="mt-10 text-sm font-semibold leading-6 text-primary"></p>
                        <ul role="list" className="mt-6 space-y-3 text-sm leading-6 text-muted-foreground">
                          {getPriceFeatures("free")?.map((feature: string, featureIndex: number) => (
                            <li key={featureIndex} className="flex gap-x-3">
                              <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter className="mt-auto">
                        <Link className="w-full flex-1" href="/docs">
                          <Button className="w-full">{"开始使用"}</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  );
                const price = product?.prices?.find((price) => price.id === features.id);
                if (!price) return null;
                return (
                  <Card key={price.id} className={cn("flex flex-col", index === 1 ? "ring-1 ring-primary" : "")}>
                    <CardHeader>
                      <CardTitle id={price.id} className="text-base font-semibold leading-7">
                        {name}
                      </CardTitle>
                      <CardDescription className="mt-6 flex items-baseline gap-x-1">
                        <span className="text-5xl font-bold tracking-tight text-primary">
                          {formatPrice(price.unit_amount, price.currency)}
                        </span>
                        {price.unit_amount && price.unit_amount > 0 && price.recurring && (
                          <span className="text-sm font-semibold leading-6 text-muted-foreground">
                            /{price.recurring.interval}
                          </span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul role="list" className="mt-6 space-y-3 text-sm leading-6 text-muted-foreground">
                        {features.features.map((feature: string, featureIndex: number) => (
                          <li key={featureIndex} className="flex gap-x-3">
                            <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="mt-auto">
                      <Button
                        className="w-full"
                        aria-describedby={price.id}
                        variant={index === 1 ? "default" : "outline"}
                        onClick={() => handleSubscribe(price.id)}
                        disabled={
                          loading === price.id || isCurrentPlan(price.id) || sessionLoading || fetchingSubscription
                        }
                      >
                        {getButtonText(price.id)}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
