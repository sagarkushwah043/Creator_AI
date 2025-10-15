"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarLoader } from "react-spinners";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react"; // Feed page dashboard button commented out

export default function Header() {
  const { isLoaded, isSignedIn } = useUser();
  const isLoading = !isLoaded;
  const isAuthenticated = isSignedIn;

  const path = usePathname();
  const router = useRouter();

  // Redirect authenticated users from landing page to feed
  useEffect(() => {
    if (!isLoading && isAuthenticated && path === "/") {
      // router.push("/feed"); // Feed page not created yet
    }
  }, [isLoading, isAuthenticated, path, router]);

  // Hide header on dashboard pages
  if (path.includes("/dashboard")) return null;

  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-5xl mx-auto px-6 flex justify-between items-center bg-slate-800/80 backdrop-blur-md shadow-lg rounded-2xl py-3 border border-slate-700/50 transition-all duration-300">
      {/* Logo / Title */}
      <Link href={isAuthenticated ? "/" : "/"}>
       <h1 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
  Creator AI
</h1>
      </Link>

      {/* Center Nav for "/" only */}
      {path === "/" && (
        <nav className="hidden md:flex gap-6">
          <a
            href="#features"
            className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-all"
          >
            Features
          </a>
          <a
            href="#testimonials"
            className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-all"
          >
            Testimonials
          </a>
        </nav>
      )}

      {/* Auth Section */}
      <div className="flex items-center gap-3">
        <Authenticated>
          {/* Feed page dashboard button commented out */}
          {path === "/feed" && (
            <Link href="/dashboard">
              <button className="hidden sm:flex items-center gap-2 bg-transparent border border-purple-500 text-purple-300 rounded-full font-medium text-sm h-10 px-4 hover:bg-purple-500 hover:text-white transition-all">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
            </Link>
          )}
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 rounded-lg border border-purple-500/40",
              },
            }}
            afterSignOutUrl="/"
          />
        </Authenticated>

        <Unauthenticated>
          <SignInButton mode="modal">
            <button className="bg-transparent border border-purple-500 text-purple-300 rounded-full font-medium text-sm h-10 px-5 hover:bg-purple-500 hover:text-white transition-all">
              Sign In
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button className="bg-purple-500 text-white rounded-full font-medium text-sm h-10 px-5 hover:bg-purple-600 transition-all">
              Sign Up
            </button>
          </SignUpButton>
        </Unauthenticated>
      </div>

      {/* Loading Bar */}
      {isLoading && (
        <div className="fixed bottom-0 left-0 w-full z-40 flex justify-center">
          <BarLoader width={"95%"} color="#A855F7" />
        </div>
      )}
    </header>
  );
}
