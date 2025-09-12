import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, Search, ArrowLeft, Calendar, Clock, Monitor, MapPin, User } from "lucide-react";
import Link from "next/link";
import { db } from "@/services/database/client";
import { session, user } from "@/services/database/schema";
import { desc, like, or, eq, gt } from "drizzle-orm";
import { sql } from "drizzle-orm";

interface SearchParams {
  search?: string;
  page?: string;
  status?: string;
}

export default async function SessionsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const search = searchParams.search || "";
  const page = Number(searchParams.page) || 1;
  const status = searchParams.status || "all";
  const limit = 20;
  const offset = (page - 1) * limit;

  // 构建查询条件
  let whereConditions = [];
  
  if (search) {
    whereConditions.push(
      or(
        like(user.name, `%${search}%`),
        like(user.email, `%${search}%`),
        like(session.ipAddress, `%${search}%`)
      )
    );
  }

  if (status === "active") {
    whereConditions.push(gt(session.expiresAt, new Date()));
  } else if (status === "expired") {
    whereConditions.push(sql`${session.expiresAt} <= ${new Date()}`);
  }

  // 获取会话数据（关联用户信息）
  const sessions = await db
    .select({
      id: session.id,
      userId: session.userId,
      token: session.token,
      expiresAt: session.expiresAt,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      userName: user.name,
      userEmail: user.email,
      userImage: user.image,
    })
    .from(session)
    .leftJoin(user, eq(session.userId, user.id))
    .where(whereConditions.length > 0 ? sql`${whereConditions.join(' AND ')}` : undefined)
    .orderBy(desc(session.createdAt))
    .limit(limit)
    .offset(offset);

  // 获取统计信息
  const [totalSessions, activeSessions, expiredSessions] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(session),
    db.select({ count: sql<number>`count(*)` }).from(session).where(gt(session.expiresAt, new Date())),
    db.select({ count: sql<number>`count(*)` }).from(session).where(sql`${session.expiresAt} <= ${new Date()}`),
  ]);

  const totalCount = totalSessions[0]?.count || 0;
  const activeCount = activeSessions[0]?.count || 0;
  const expiredCount = expiredSessions[0]?.count || 0;
  const totalPages = Math.ceil(sessions.length / limit);

  // 判断会话是否过期
  const isSessionExpired = (expiresAt: Date) => {
    return new Date() > new Date(expiresAt);
  };

  // 格式化User Agent
  const formatUserAgent = (userAgent: string | null) => {
    if (!userAgent) return "未知";
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Safari")) return "Safari";
    if (userAgent.includes("Edge")) return "Edge";
    return "其他";
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
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">会话管理</h1>
        </div>
        <p className="text-muted-foreground">
          查看和管理用户会话信息
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总会话数</CardTitle>
            <Shield className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground">所有会话记录</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃会话</CardTitle>
            <Clock className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCount}</div>
            <p className="text-xs text-muted-foreground">未过期的会话</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">过期会话</CardTitle>
            <Clock className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{expiredCount}</div>
            <p className="text-xs text-muted-foreground">已过期的会话</p>
          </CardContent>
        </Card>
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
              <Input
                name="search"
                placeholder="搜索用户名、邮箱或IP地址..."
                defaultValue={search}
                className="pl-10"
              />
            </div>
            <select
              name="status"
              defaultValue={status}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="all">所有会话</option>
              <option value="active">活跃会话</option>
              <option value="expired">过期会话</option>
            </select>
            <Button type="submit">搜索</Button>
            {(search || status !== "all") && (
              <Link href="/admin/sessions">
                <Button variant="outline">清除</Button>
              </Link>
            )}
          </form>
        </CardContent>
      </Card>

      {/* 会话表格 */}
      <Card>
        <CardHeader>
          <CardTitle>会话列表</CardTitle>
          <CardDescription>
            {search ? `搜索 "${search}" 的结果` : "所有用户会话"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>用户</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>IP地址</TableHead>
                  <TableHead>浏览器</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>过期时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Shield className="w-8 h-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {search ? "未找到匹配的会话" : "暂无会话数据"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  sessions.map((s: any) => {
                    const expired = isSessionExpired(s.expiresAt);
                    return (
                      <TableRow key={s.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={s.userImage || undefined} />
                              <AvatarFallback>
                                {s.userName?.charAt(0)?.toUpperCase() || s.userEmail?.charAt(0).toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{s.userName || "未设置"}</div>
                              <div className="text-sm text-muted-foreground">{s.userEmail}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={expired ? "destructive" : "default"} className={expired ? "" : "bg-green-500"}>
                            {expired ? "已过期" : "活跃"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-mono">{s.ipAddress || "未知"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Monitor className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{formatUserAgent(s.userAgent)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              {s.createdAt ? new Date(s.createdAt).toLocaleString('zh-CN') : "未知"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className={`w-4 h-4 ${expired ? 'text-red-500' : 'text-green-500'}`} />
                            <span className={`text-sm ${expired ? 'text-red-600' : 'text-green-600'}`}>
                              {new Date(s.expiresAt).toLocaleString('zh-CN')}
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
                显示第 {offset + 1} - {Math.min(offset + limit, sessions.length)} 条记录
              </div>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link href={`/admin/sessions?page=${page - 1}${search ? `&search=${search}` : ''}${status !== 'all' ? `&status=${status}` : ''}`}>
                    <Button variant="outline" size="sm">
                      上一页
                    </Button>
                  </Link>
                )}
                {page < totalPages && (
                  <Link href={`/admin/sessions?page=${page + 1}${search ? `&search=${search}` : ''}${status !== 'all' ? `&status=${status}` : ''}`}>
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