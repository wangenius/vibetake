"use client";
import { Button } from "@/components/ui/button";

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
                  href="https://github.com/wangenius/next-template"
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
              <Button variant="outline">
                <a href="/docs">Read Docs</a>
              </Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center">
          <p className="text-base text-gray-400">
            © 2024 vibetake. Open source under MIT License.
          </p>
        </div>
      </div>
    </footer>
  );
}
