"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Menu, X } from "lucide-react";
import { IconBrandX, IconBrandGithub } from "@tabler/icons-react";

import { signOut, useSession } from "@/services/userauth/auth-client";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function Navbar() {
  const { data: session, isPending } = useSession();
  const [isClient, setIsClient] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 关闭移动端菜单
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // 切换移动端菜单
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex items-center space-x-6 text-sm">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-3">
                <Link href="/">
                  <img src="/icon-black.svg" alt="vibetake" className="h-8 w-8" />
                </Link>
                <span className="text-xl font-semibold tracking-tight">
                  vibetake
                </span>
              </div>
              
              {/* 移动端汉堡菜单按钮 */}
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 md:hidden"
                  onClick={toggleMobileMenu}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Menu className="h-4 w-4" />
                  )}
                  <span className="sr-only">Toggle menu</span>
                </Button>
              )}
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/docs">
                <Button variant="ghost" className="text-sm font-medium">
                  Docs
                </Button>
              </Link>
              <Link href="https://x.com/iamwangenius" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <IconBrandX className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Button>
              </Link>
              <Link href="https://github.com/wangenius/next-template" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <IconBrandGithub className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Button>
              </Link>
              {isPending ? (
                <div className="flex items-center">
                  <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
                </div>
              ) : session?.user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={session.user.image || ""}
                          alt={session.user.name || ""}
                        />
                        <AvatarFallback>
                          {session.user.name?.charAt(0) ||
                            session.user.email?.charAt(0) ||
                            "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {session.user.name || "user"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="flex items-center"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex items-center space-x-3">
                  <Link href="/login">
                    <Button variant="ghost" className="text-sm font-medium">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="text-sm font-medium shadow-sm">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* 移动端侧边栏菜单 */}
      {isMobile && isMobileMenuOpen && (
        <div className="md:hidden">
          {/* 背景遮罩 */}
          <div 
            className="fixed inset-0 z-40 bg-black/50 animate-in fade-in-0 duration-300" 
            onClick={closeMobileMenu}
          />
          
          {/* 侧边栏内容 */}
          <div className="fixed top-0 right-0 z-50 h-full w-64 bg-background border-l border-border shadow-lg animate-in slide-in-from-right-0 duration-300">
            <div className="flex flex-col h-full">
              {/* 头部 */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="text-lg font-semibold">Menu</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={closeMobileMenu}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>
              
              {/* 导航项 */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  <Link href="/docs" onClick={closeMobileMenu}>
                    <Button variant="ghost" className="w-full justify-start text-sm font-medium">
                      Docs
                    </Button>
                  </Link>
                  
                  <div className="flex items-center space-x-2">
                    <Link href="https://x.com/iamwangenius" target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <IconBrandX className="h-4 w-4" />
                        <span className="sr-only">Twitter</span>
                      </Button>
                    </Link>
                    <Link href="https://github.com/wangenius/next-template" target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <IconBrandGithub className="h-4 w-4" />
                        <span className="sr-only">GitHub</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* 用户认证区域 */}
              <div className="p-4 border-t border-border">
                {isPending ? (
                  <div className="flex items-center justify-center">
                    <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
                  </div>
                ) : session?.user ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={session.user.image || ""}
                          alt={session.user.name || ""}
                        />
                        <AvatarFallback>
                          {session.user.name?.charAt(0) ||
                            session.user.email?.charAt(0) ||
                            "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium leading-none">
                          {session.user.name || "user"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground mt-1">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        handleSignOut();
                        closeMobileMenu();
                      }}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link href="/login" onClick={closeMobileMenu}>
                      <Button variant="ghost" className="w-full justify-start text-sm font-medium">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" onClick={closeMobileMenu}>
                      <Button className="w-full text-sm font-medium shadow-sm">
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
