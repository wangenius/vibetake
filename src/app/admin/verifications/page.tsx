import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, Search, ArrowLeft, Calendar, Mail, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { db } from "@/services/database/client";
import { verification } from "@/services/database/schema";
import { desc, like, gt, sql } from "drizzle-orm";

interface SearchParams {
  search?: string;
  page?: string;
  status?: string;
}

export default async function VerificationsPage({
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
      like(verification.identifier, `%${search}%`)
    );
  }

  if (status === "active") {
    whereConditions.push(gt(verification.expiresAt, new Date()));
  } else if (status === "expired") {
    whereConditions.push(sql`${verification.expiresAt} <= ${new Date()}`);
  }

  // 获取验证数据
  const verifications = await db
    .select()
    .from(verification)
    .where(whereConditions.length > 0 ? sql`${whereConditions.join(' AND ')}` : undefined)
    .orderBy(desc(verification.createdAt))
    .limit(limit)
    .offset(offset);

  // 获取统计信息
  const [totalVerifications, activeVerifications, expiredVerifications] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(verification),
    db.select({ count: sql<number>`count(*)` }).from(verification).where(gt(verification.expiresAt, new Date())),
    db.select({ count: sql<number>`count(*)` }).from(verification).where(sql`${verification.expiresAt} <= ${new Date()}`),
  ]);

  const totalCount = totalVerifications[0]?.count || 0;
  const activeCount = activeVerifications[0]?.count || 0;
  const expiredCount = expiredVerifications[0]?.count || 0;
  const totalPages = Math.ceil(verifications.length / limit);

  // 判断验证是否过期
  const isVerificationExpired = (expiresAt: Date) => {
    return new Date() > new Date(expiresAt);
  };

  // 判断验证是否即将过期（1小时内）
  const isVerificationExpiringSoon = (expiresAt: Date) => {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    return new Date(expiresAt) <= oneHourLater && new Date(expiresAt) > now;
  };

  // 获取验证类型图标
  const getVerificationIcon = (identifier: string) => {
    if (identifier.includes('@')) {
      return <Mail className="w-4 h-4" />;
    }
    return <Clock className="w-4 h-4" />;
  };

  // 格式化验证类型
  const getVerificationType = (identifier: string) => {
    if (identifier.includes('@')) {
      return '邮箱验证';
    }
    if (identifier.startsWith('phone:')) {
      return '手机验证';
    }
    if (identifier.startsWith('reset:')) {
      return '密码重置';
    }
    return '其他验证';
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
          <Clock className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">验证管理</h1>
        </div>
        <p className="text-muted-foreground">
          查看和管理用户验证请求（邮箱验证、密码重置等）
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总验证数</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground">所有验证记录</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">有效验证</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCount}</div>
            <p className="text-xs text-muted-foreground">未过期的验证</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">过期验证</CardTitle>
            <XCircle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{expiredCount}</div>
            <p className="text-xs text-muted-foreground">已过期的验证</p>
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
                placeholder="搜索邮箱或标识符..."
                defaultValue={search}
                className="pl-10"
              />
            </div>
            <select
              name="status"
              defaultValue={status}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="all">所有验证</option>
              <option value="active">有效验证</option>
              <option value="expired">过期验证</option>
            </select>
            <Button type="submit">搜索</Button>
            {(search || status !== "all") && (
              <Link href="/admin/verifications">
                <Button variant="outline">清除</Button>
              </Link>
            )}
          </form>
        </CardContent>
      </Card>

      {/* 验证表格 */}
      <Card>
        <CardHeader>
          <CardTitle>验证列表</CardTitle>
          <CardDescription>
            {search ? `搜索 "${search}" 的结果` : "所有验证记录"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>类型</TableHead>
                  <TableHead>标识符</TableHead>
                  <TableHead>验证码</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>过期时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {verifications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Clock className="w-8 h-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {search ? "未找到匹配的验证" : "暂无验证数据"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  verifications.map((v: any) => {
                    const expired = isVerificationExpired(v.expiresAt);
                    const expiringSoon = isVerificationExpiringSoon(v.expiresAt);
                    
                    return (
                      <TableRow key={v.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getVerificationIcon(v.identifier)}
                            <Badge variant="outline">
                              {getVerificationType(v.identifier)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-mono text-sm">
                            {v.identifier.length > 30 
                              ? `${v.identifier.substring(0, 30)}...` 
                              : v.identifier
                            }
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-mono text-sm bg-muted px-2 py-1 rounded inline-block">
                            {v.value.length > 10 
                              ? `${v.value.substring(0, 10)}...` 
                              : v.value
                            }
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {expired ? (
                              <>
                                <XCircle className="w-4 h-4 text-red-500" />
                                <Badge variant="destructive">已过期</Badge>
                              </>
                            ) : expiringSoon ? (
                              <>
                                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                <Badge variant="secondary" className="bg-yellow-500 text-white">
                                  即将过期
                                </Badge>
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <Badge variant="default" className="bg-green-500">
                                  有效
                                </Badge>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              {v.createdAt ? new Date(v.createdAt).toLocaleString('zh-CN') : "未知"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className={`w-4 h-4 ${
                              expired ? 'text-red-500' : expiringSoon ? 'text-yellow-500' : 'text-green-500'
                            }`} />
                            <span className={`text-sm ${
                              expired ? 'text-red-600' : expiringSoon ? 'text-yellow-600' : 'text-green-600'
                            }`}>
                              {new Date(v.expiresAt).toLocaleString('zh-CN')}
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
                显示第 {offset + 1} - {Math.min(offset + limit, verifications.length)} 条记录
              </div>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link href={`/admin/verifications?page=${page - 1}${search ? `&search=${search}` : ''}${status !== 'all' ? `&status=${status}` : ''}`}>
                    <Button variant="outline" size="sm">
                      上一页
                    </Button>
                  </Link>
                )}
                {page < totalPages && (
                  <Link href={`/admin/verifications?page=${page + 1}${search ? `&search=${search}` : ''}${status !== 'all' ? `&status=${status}` : ''}`}>
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