import { desc, eq, like, or, sql } from "drizzle-orm";
import { ArrowLeft, Calendar, Key, Mail, Search, Shield, User } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { db } from "@/services/database/client";
import { account, user } from "@/services/database/schema";

interface SearchParams {
  search?: string;
  page?: string;
  provider?: string;
}

export default async function AccountsPage({ searchParams }: { searchParams: SearchParams }) {
  const search = searchParams.search || "";
  const page = Number(searchParams.page) || 1;
  const provider = searchParams.provider || "all";
  const limit = 20;
  const offset = (page - 1) * limit;

  // 构建查询条件
  let whereConditions = [];

  if (search) {
    whereConditions.push(
      or(like(user.name, `%${search}%`), like(user.email, `%${search}%`), like(account.providerId, `%${search}%`)),
    );
  }

  if (provider !== "all") {
    whereConditions.push(eq(account.providerId, provider));
  }

  // 获取账户数据（关联用户信息）
  const accounts = await db
    .select({
      id: account.id,
      userId: account.userId,
      accountId: account.accountId,
      providerId: account.providerId,
      accessToken: account.accessToken,
      refreshToken: account.refreshToken,
      accessTokenExpiresAt: account.accessTokenExpiresAt,
      refreshTokenExpiresAt: account.refreshTokenExpiresAt,
      scope: account.scope,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
      userName: user.name,
      userEmail: user.email,
      userImage: user.image,
    })
    .from(account)
    .leftJoin(user, eq(account.userId, user.id))
    .where(whereConditions.length > 0 ? sql`${whereConditions.join(" AND ")}` : undefined)
    .orderBy(desc(account.createdAt))
    .limit(limit)
    .offset(offset);

  // 获取统计信息
  const [totalAccounts, providerStats] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(account),
    db
      .select({
        providerId: account.providerId,
        count: sql<number>`count(*)`,
      })
      .from(account)
      .groupBy(account.providerId),
  ]);

  const totalCount = totalAccounts[0]?.count || 0;
  const totalPages = Math.ceil(accounts.length / limit);

  // 获取提供商图标
  const getProviderIcon = (providerId: string) => {
    switch (providerId.toLowerCase()) {
      case "google":
        return "🔍";
      case "github":
        return "🐙";
      case "discord":
        return "💬";
      case "email":
      case "credential":
        return "📧";
      default:
        return "🔑";
    }
  };

  // 格式化提供商名称
  const formatProviderName = (providerId: string) => {
    switch (providerId.toLowerCase()) {
      case "google":
        return "Google";
      case "github":
        return "GitHub";
      case "discord":
        return "Discord";
      case "email":
      case "credential":
        return "邮箱密码";
      default:
        return providerId;
    }
  };

  // 判断令牌是否过期
  const isTokenExpired = (expiresAt: Date | null) => {
    if (!expiresAt) return false;
    return new Date() > new Date(expiresAt);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* 头部 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
          </Link>
          <Key className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">账户管理</h1>
        </div>
        <p className="text-muted-foreground">查看用户的第三方账户关联信息</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总账户数</CardTitle>
            <Key className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground">所有关联账户</p>
          </CardContent>
        </Card>

        {providerStats.slice(0, 3).map((stat: { providerId: string; count: number }) => (
          <Card key={stat.providerId}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{formatProviderName(stat.providerId)}</CardTitle>
              <span className="text-lg">{getProviderIcon(stat.providerId)}</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.count}</div>
              <p className="text-xs text-muted-foreground">关联账户数</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 搜索和过滤 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">搜索和过滤</CardTitle>
        </CardHeader>
        <CardContent>
          <form method="GET" className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input name="search" placeholder="搜索用户名、邮箱或提供商..." defaultValue={search} className="pl-10" />
            </div>
            <select
              name="provider"
              defaultValue={provider}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="all">所有提供商</option>
              {providerStats.map((stat: { providerId: string; count: number }) => (
                <option key={stat.providerId} value={stat.providerId}>
                  {formatProviderName(stat.providerId)} ({stat.count})
                </option>
              ))}
            </select>
            <Button type="submit">搜索</Button>
            {(search || provider !== "all") && (
              <Link href="/admin/accounts">
                <Button variant="outline">清除</Button>
              </Link>
            )}
          </form>
        </CardContent>
      </Card>

      {/* 账户表格 */}
      <Card>
        <CardHeader>
          <CardTitle>账户列表</CardTitle>
          <CardDescription>{search ? `搜索 "${search}" 的结果` : "所有用户关联账户"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>用户</TableHead>
                  <TableHead>提供商</TableHead>
                  <TableHead>账户ID</TableHead>
                  <TableHead>访问令牌状态</TableHead>
                  <TableHead>权限范围</TableHead>
                  <TableHead>创建时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Key className="w-8 h-8 text-muted-foreground" />
                        <p className="text-muted-foreground">{search ? "未找到匹配的账户" : "暂无账户数据"}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  accounts.map((acc: any) => {
                    const accessTokenExpired = isTokenExpired(acc.accessTokenExpiresAt);
                    const refreshTokenExpired = isTokenExpired(acc.refreshTokenExpiresAt);

                    return (
                      <TableRow key={acc.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={acc.userImage || undefined} />
                              <AvatarFallback>
                                {acc.userName?.charAt(0)?.toUpperCase() ||
                                  acc.userEmail?.charAt(0).toUpperCase() ||
                                  "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{acc.userName || "未设置"}</div>
                              <div className="text-sm text-muted-foreground">{acc.userEmail}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getProviderIcon(acc.providerId)}</span>
                            <Badge variant="outline">{formatProviderName(acc.providerId)}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-mono">{acc.accountId}</span>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {acc.accessToken && (
                              <Badge
                                variant={accessTokenExpired ? "destructive" : "default"}
                                className={accessTokenExpired ? "" : "bg-green-500"}
                              >
                                访问令牌 {accessTokenExpired ? "已过期" : "有效"}
                              </Badge>
                            )}
                            {acc.refreshToken && (
                              <Badge
                                variant={refreshTokenExpired ? "destructive" : "secondary"}
                                className={refreshTokenExpired ? "" : "bg-blue-500"}
                              >
                                刷新令牌 {refreshTokenExpired ? "已过期" : "有效"}
                              </Badge>
                            )}
                            {!acc.accessToken && !acc.refreshToken && <Badge variant="outline">无令牌</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>
                          {acc.scope ? (
                            <div className="max-w-32">
                              <span className="text-sm text-muted-foreground truncate block" title={acc.scope}>
                                {acc.scope}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">未设置</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              {acc.createdAt ? new Date(acc.createdAt).toLocaleString("zh-CN") : "未知"}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                显示第 {offset + 1} - {Math.min(offset + limit, accounts.length)} 条记录
              </div>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={`/admin/accounts?page=${page - 1}${search ? `&search=${search}` : ""}${provider !== "all" ? `&provider=${provider}` : ""}`}
                  >
                    <Button variant="outline" size="sm">
                      上一页
                    </Button>
                  </Link>
                )}
                {page < totalPages && (
                  <Link
                    href={`/admin/accounts?page=${page + 1}${search ? `&search=${search}` : ""}${provider !== "all" ? `&provider=${provider}` : ""}`}
                  >
                    <Button variant="outline" size="sm">
                      下一页
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
