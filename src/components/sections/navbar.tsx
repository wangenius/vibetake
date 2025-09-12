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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogOut, Menu } from "lucide-react";
import { IconBrandX, IconBrandGithub } from "@tabler/icons-react";

import { signOut, useSession } from "@/services/userauth/auth-client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function Navbar() {
  const { data: session, isPending } = useSession();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 lg:px-8 py-3">
        {/* 桌面端导航 */}
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <img src="/icon-black.svg" alt="vibetake" className="h-8 w-8" />
              <span className="text-xl font-semibold tracking-tight">
                vibetake
              </span>
            </Link>

            {/* 导航链接 */}
            <div className="flex items-center space-x-6">
              <Link href="/docs">
                <Button variant="ghost" className="text-sm font-medium">
                  Docs
                </Button>
              </Link>
            </div>
          </div>

          {/* 用户认证区域 */}
          <div className="flex items-center gap-2">
            <Link
              href="https://x.com/iamwangenius"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <IconBrandX className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Button>
            </Link>
            <Link
              href="https://github.com/wangenius/next-template"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <IconBrandGithub className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Button>
            </Link>
            {isPending ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
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
              <>
                <Button asChild variant="outline" size="sm">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* 移动端导航 */}
        <div className="block lg:hidden">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <img src="/icon-black.svg" alt="vibetake" className="h-8 w-8" />
              <span className="text-xl font-semibold tracking-tight">
                vibetake
              </span>
            </Link>

            {/* 移动端菜单 */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link href="/" className="flex items-center gap-2">
                      <img
                        src="/icon-black.svg"
                        alt="vibetake"
                        className="h-8 w-8"
                      />
                      <span className="text-xl font-semibold tracking-tight">
                        vibetake
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-6 p-4">
                  {/* 导航链接 */}
                  <div className="flex flex-col gap-4">
                    <Link href="/docs">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sm font-medium"
                      >
                        Docs
                      </Button>
                    </Link>

                    <div className="flex items-center gap-2">
                      <Link
                        href="https://x.com/iamwangenius"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <IconBrandX className="h-4 w-4" />
                          <span className="sr-only">Twitter</span>
                        </Button>
                      </Link>
                      <Link
                        href="https://github.com/wangenius/next-template"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <IconBrandGithub className="h-4 w-4" />
                          <span className="sr-only">GitHub</span>
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* 用户认证区域 */}
                  <div className="flex flex-col gap-3">
                    {isPending ? (
                      <div className="flex items-center justify-center">
                        <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
                      </div>
                    ) : session?.user ? (
                      <>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
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
                          onClick={handleSignOut}
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Sign Out</span>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button asChild variant="outline">
                          <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild>
                          <Link href="/register">Register</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
