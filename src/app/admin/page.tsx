import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Users, Key, Shield, Clock } from "lucide-react";
import Link from "next/link";
import { db } from "@/services/database/client";
import { user, account, session, verification } from "@/services/database/schema";
import { sql } from "drizzle-orm";

export default async function AdminDashboard() {
  // 获取数据库统计信息
  const [userCount, accountCount, sessionCount, verificationCount] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(user),
    db.select({ count: sql<number>`count(*)` }).from(account),
    db.select({ count: sql<number>`count(*)` }).from(session),
    db.select({ count: sql<number>`count(*)` }).from(verification),
  ]);

  const stats = [
    {
      title: "用户",
      count: userCount[0]?.count || 0,
      description: "注册用户总数",
      icon: Users,
      href: "/admin/users",
      color: "bg-blue-500"
    },
    {
      title: "账户",
      count: accountCount[0]?.count || 0,
      description: "关联账户总数",
      icon: Key,
      href: "/admin/accounts",
      color: "bg-green-500"
    },
    {
      title: "会话",
      count: sessionCount[0]?.count || 0,
      description: "活跃会话总数",
      icon: Shield,
      href: "/admin/sessions",
      color: "bg-orange-500"
    },
    {
      title: "验证",
      count: verificationCount[0]?.count || 0,
      description: "待验证项目",
      icon: Clock,
      href: "/admin/verifications",
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">数据库管理</h1>
        </div>
        <p className="text-muted-foreground">
          管理和监控应用程序的数据库表和数据
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`w-8 h-8 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.count}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
            <CardDescription>
              常用的数据库管理操作
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Link href="/admin/users">
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <Users className="w-5 h-5 mb-2 text-primary" />
                  <div className="text-sm font-medium">用户管理</div>
                  <div className="text-xs text-muted-foreground">查看和管理用户</div>
                </div>
              </Link>
              <Link href="/admin/sessions">
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <Shield className="w-5 h-5 mb-2 text-primary" />
                  <div className="text-sm font-medium">会话管理</div>
                  <div className="text-xs text-muted-foreground">管理用户会话</div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>系统状态</CardTitle>
            <CardDescription>
              数据库和系统运行状态
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">数据库连接</span>
                <Badge variant="default" className="bg-green-500">
                  正常
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">认证服务</span>
                <Badge variant="default" className="bg-green-500">
                  运行中
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">总数据量</span>
                <Badge variant="outline">
                  {(userCount[0]?.count || 0) + (accountCount[0]?.count || 0) + (sessionCount[0]?.count || 0) + (verificationCount[0]?.count || 0)} 条记录
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}