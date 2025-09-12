"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <XCircle className="w-6 h-6" />
              支付已取消
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              您已取消了支付流程。如果您改变主意，可以随时重新开始。
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link href="/payment">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  重新选择计划
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">返回首页</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}