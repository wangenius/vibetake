"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "@/services/userauth/auth-client";
import { motion } from "framer-motion";
import { ArrowRight, LogOut, Copy, Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session, isPending } = useSession();
  const [isClient, setIsClient] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText("npm i -g vibecape");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <img src="/icon-black.svg" alt="vibecape" className="h-8 w-8" />
              </Link>
              <span className="text-xl font-semibold tracking-tight">
                vibecape
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/docs">
                <Button variant="ghost" className="text-sm font-medium">
                  Docs
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
                <div className="flex items-center space-x-3">
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

      {/* Hero Section - Casino Style */}
      <section className="relative bg-white">
        <div className="container relative mx-auto px-6 lg:px-8">
          <div className="relative mx-auto max-w-6xl py-10 text-center lg:py-24">
            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8 text-5xl font-bold tracking-tight text-black sm:text-6xl lg:text-7xl"
            >
              vibecape
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mx-auto mb-8 max-w-2xl text-lg leading-7 text-gray-600"
            >
              modern web template based on Next.js 15
            </motion.p>

            {/* Installation Command */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-12 flex flex-col items-center justify-center gap-4"
            >
              <div className="group relative">
                <div className="flex items-center rounded-lg border border-gray-200 bg-gray-200 p-3 gap-6 pl-6 pr-4 font-mono text-sm transition-colors hover:border-gray-300">
                  <pre>npm i -g vibecape</pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                    className="h-7 w-7"
                  >
                    {copied ? (
                      <Check className="h-3 w-3 text-gray-700" />
                    ) : (
                      <Copy className="h-3 w-3 text-gray-800" />
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Tech Stack Poker Cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="relative"
            >
              <div className="relative mx-auto max-w-4xl">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                  {[
                    "Next.js",
                    "TypeScript",
                    "Tailwind CSS",
                    "shadcn/ui",
                    "Drizzle ORM",
                    "BetterAuth",
                    "fumadocs",
                    "ai-sdk",
                    "stripe",
                    "framer-motion",
                    "biomejs",
                    "libsql",
                    "supabase",
                  ].map((tech, index) => (
                    <motion.div
                      key={tech}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                      className="flex items-center justify-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {tech}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
