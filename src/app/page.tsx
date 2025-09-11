import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, Shield, Rocket, Star, Users, Globe } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">NextTemplate</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/docs">
                <Button variant="ghost">文档</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">登录</Button>
              </Link>
              <Link href="/register">
                <Button>开始使用</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            🚀 现代化全栈开发模板
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            构建下一代
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Web 应用
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            基于 Next.js 14、TypeScript、Tailwind CSS 和 shadcn/ui 构建的现代化全栈开发模板。
            集成身份验证、数据库、支付和 AI 功能，让您专注于业务逻辑。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                立即开始
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                查看文档
              </Button>
            </Link>
          </div>
          <div className="mt-12 flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>开源免费</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>社区支持</span>
            </div>
            <div className="flex items-center space-x-1">
              <Globe className="w-4 h-4" />
              <span>生产就绪</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">强大的功能特性</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              我们为您准备了构建现代 Web 应用所需的一切工具和服务
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>身份验证</CardTitle>
                <CardDescription>
                  集成 BetterAuth，支持多种登录方式，包括邮箱、社交登录等
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>现代化 UI</CardTitle>
                <CardDescription>
                  基于 Tailwind CSS v4 和 shadcn/ui，提供美观且可定制的组件库
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>全栈开发</CardTitle>
                <CardDescription>
                  Next.js 14 + TypeScript + Drizzle ORM，提供完整的全栈开发体验
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">技术栈</h2>
            <p className="text-xl text-muted-foreground">
              使用业界最佳实践和现代化技术构建
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              { name: "Next.js", desc: "React 框架" },
              { name: "TypeScript", desc: "类型安全" },
              { name: "Tailwind CSS", desc: "样式框架" },
              { name: "shadcn/ui", desc: "组件库" },
              { name: "Drizzle ORM", desc: "数据库 ORM" },
              { name: "BetterAuth", desc: "身份验证" },
              { name: "Vercel AI SDK", desc: "AI 集成" },
              { name: "Stripe", desc: "支付处理" },
              { name: "Fumadocs", desc: "文档系统" },
              { name: "Zustand", desc: "状态管理" },
              { name: "LibSQL", desc: "数据库" },
              { name: "Biome", desc: "代码格式化" }
            ].map((tech, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-primary">{tech.name.charAt(0)}</span>
                </div>
                <h3 className="font-semibold text-sm">{tech.name}</h3>
                <p className="text-xs text-muted-foreground">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            准备好开始您的项目了吗？
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            立即使用我们的模板，快速构建您的下一个 Web 应用。完全免费，开源可定制。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                免费注册
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                查看文档
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">NextTemplate</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link href="/docs" className="hover:text-foreground transition-colors">
                文档
              </Link>
              <Link href="/login" className="hover:text-foreground transition-colors">
                登录
              </Link>
              <Link href="/register" className="hover:text-foreground transition-colors">
                注册
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2024 NextTemplate. 基于 MIT 许可证开源。</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
