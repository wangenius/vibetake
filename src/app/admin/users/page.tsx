import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Search, ArrowLeft, Mail, Calendar, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { db } from "@/services/database/client";
import { user } from "@/services/database/schema";
import { desc, like, or } from "drizzle-orm";

interface SearchParams {
  search?: string;
  page?: string;
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const search = searchParams.search || "";
  const page = Number(searchParams.page) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  // 构建查询条件
  let whereCondition;
  if (search) {
    whereCondition = or(
      like(user.name, `%${search}%`),
      like(user.email, `%${search}%`)
    );
  }

  // 获取用户数据
  const users = await db
    .select()
    .from(user)
    .where(whereCondition)
    .orderBy(desc(user.createdAt))
    .limit(limit)
    .offset(offset);

  // 获取总数用于分页
  const totalUsers = await db
    .select({ count: user.id })
    .from(user)
    .where(whereCondition);

  const totalCount = totalUsers.length;
  const totalPages = Math.ceil(totalCount / limit);

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
          <Users className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">用户管理</h1>
        </div>
        <p className="text-muted-foreground">
          查看和管理所有注册用户
        </p>
      </div>

      {/* 搜索和统计 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">搜索用户</CardTitle>
          </CardHeader>
          <CardContent>
            <form method="GET" className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  name="search"
                  placeholder="搜索用户名或邮箱..."
                  defaultValue={search}
                  className="pl-10"
                />
              </div>
              <Button type="submit">搜索</Button>
              {search && (
                <Link href="/admin/users">
                  <Button variant="outline">清除</Button>
                </Link>
              )}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">统计信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">总用户数</span>
                <Badge variant="outline">{totalCount}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">当前页</span>
                <Badge variant="outline">{page}/{totalPages}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 用户表格 */}
      <Card>
        <CardHeader>
          <CardTitle>用户列表</CardTitle>
          <CardDescription>
            {search ? `搜索 "${search}" 的结果` : "所有注册用户"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>用户</TableHead>
                  <TableHead>邮箱</TableHead>
                  <TableHead>邮箱验证</TableHead>
                  <TableHead>注册时间</TableHead>
                  <TableHead>最后更新</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="w-8 h-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {search ? "未找到匹配的用户" : "暂无用户数据"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={u.image || undefined} />
                            <AvatarFallback>
                              {u.name?.charAt(0)?.toUpperCase() || u.email.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{u.name || "未设置"}</div>
                            <div className="text-sm text-muted-foreground">ID: {u.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {u.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {u.emailVerified ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <Badge variant="default" className="bg-green-500">
                                已验证
                              </Badge>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-red-500" />
                              <Badge variant="destructive">
                                未验证
                              </Badge>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            {u.createdAt ? new Date(u.createdAt).toLocaleString('zh-CN') : "未知"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {u.updatedAt ? new Date(u.updatedAt).toLocaleString('zh-CN') : "未知"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                显示第 {offset + 1} - {Math.min(offset + limit, totalCount)} 条，共 {totalCount} 条记录
              </div>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link href={`/admin/users?page=${page - 1}${search ? `&search=${search}` : ''}`}>
                    <Button variant="outline" size="sm">
                      上一页
                    </Button>
                  </Link>
                )}
                {page < totalPages && (
                  <Link href={`/admin/users?page=${page + 1}${search ? `&search=${search}` : ''}`}>
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