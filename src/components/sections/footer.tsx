"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Instagram, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap">
          {/* Template Info */}
          <div className="w-full md:w-1/4 text-center md:text-left">
            <h5 className="uppercase mb-6 font-bold">Template</h5>
            <ul className="mb-4">
              <li className="mt-2">
                <a
                  href="https://github.com/yourusername/vibe-template"
                  className="hover:underline text-gray-600 hover:text-gray-800"
                >
                  GitHub Repository
                </a>
              </li>
              <li className="mt-2">
                <a
                  href="/docs"
                  className="hover:underline text-gray-600 hover:text-gray-800"
                >
                  Documentation
                </a>
              </li>
              <li className="mt-2">
                <a
                  href="/changelog"
                  className="hover:underline text-gray-600 hover:text-gray-800"
                >
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="w-full md:w-1/4 text-center md:text-left">
            <h5 className="uppercase mb-6 font-bold">Features</h5>
            <ul className="mb-4">
              <li className="mt-2">
                <a
                  href="/auth"
                  className="hover:underline text-gray-600 hover:text-gray-800"
                >
                  Authentication
                </a>
              </li>
              <li className="mt-2">
                <a
                  href="/dashboard"
                  className="hover:underline text-gray-600 hover:text-gray-800"
                >
                  Dashboard
                </a>
              </li>
              <li className="mt-2">
                <a
                  href="/admin"
                  className="hover:underline text-gray-600 hover:text-gray-800"
                >
                  Admin Panel
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="w-full md:w-1/4 text-center md:text-left">
            <h5 className="uppercase mb-6 font-bold">Resources</h5>
            <ul className="mb-4">
              <li className="mt-2">
                <a
                  href="/examples"
                  className="hover:underline text-gray-600 hover:text-gray-800"
                >
                  Examples
                </a>
              </li>
              <li className="mt-2">
                <a
                  href="/components"
                  className="hover:underline text-gray-600 hover:text-gray-800"
                >
                  Components
                </a>
              </li>
              <li className="mt-2">
                <a
                  href="/community"
                  className="hover:underline text-gray-600 hover:text-gray-800"
                >
                  Community
                </a>
              </li>
            </ul>
          </div>

          {/* Get Started */}
          <div className="w-full md:w-1/4 text-center md:text-left">
            <h5 className="uppercase mb-6 font-bold">Get Started</h5>
            <div className="flex flex-col">
              <Button className="mb-2">
                <a href="https://github.com/yourusername/vibe-template" className="text-white">
                  Clone Template
                </a>
              </Button>
              <Button variant="outline">
                <a href="/docs">
                  Read Docs
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center mt-8 space-x-6">
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Facebook</span>
            <Facebook className="h-6 w-6" />
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Instagram</span>
            <Instagram className="h-6 w-6" />
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Twitter</span>
            <Twitter className="h-6 w-6" />
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">GitHub</span>
            <Github className="h-6 w-6" />
          </a>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center">
          <p className="text-base text-gray-400">
            © 2024 VibeCape. Open source under MIT License.
          </p>
        </div>
      </div>
    </footer>
  );
}
