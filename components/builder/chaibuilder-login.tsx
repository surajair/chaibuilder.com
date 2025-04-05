"use client";

import FullScreenLoader from "@/components/builder/loader";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { Button } from "@chaibuilder/sdk/ui";
import type React from "react";

/**
 * @description
 * Enhanced Builder login page with improved UI
 */
export default function Login({ logo }: { logo: React.ReactNode }) {
  const { login, loading, error } = useSupabaseAuth();
  if (loading) return <FullScreenLoader />;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-6">{logo}</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Welcome to Chai Builder
          </h1>
          <p className="text-gray-600">
            Sign in to start building your amazing website
          </p>
        </div>

        <div className="space-y-6">
          <Button
            role="button"
            onClick={login}
            disabled={loading}
            className="flex items-center justify-center gap-3 w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 py-3.5 px-4 rounded-xl transition-all shadow-sm font-medium">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            <span>Continue with Google</span>
          </Button>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          By signing in, you agree to our{" "}
          <a
            target="_blank"
            href="https://www.chaibuilder.com/terms-and-conditions"
            className="text-purple-600 hover:text-purple-700 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            target="_blank"
            href="https://www.chaibuilder.com/privacy-policy"
            className="text-purple-600 hover:text-purple-700 hover:underline">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
