"use client";

import { useBuilderAuth } from "@/hooks/use-builder-auth";
import Image from "next/image";
import React from "react";
import FullScreenLoader from "./Loader";

/**
 * @description
 * Builder login page
 */
export default function Login({ logo }: { logo: React.ComponentType }) {
  const { login, loading, logout, isLoggedIn, user, error } = useBuilderAuth();

  if (isLoggedIn) return <button onClick={logout}>Logout</button>;
  if (loading && !user) return <FullScreenLoader />;

  return (
    <section className="h-screen w-screen flex flex-col space-y-8 items-center justify-center">
      <a
        className="flex-none flex rounded text-xl items-center font-semibold focus:outline-none focus:opacity-80"
        aria-label="Chai Builder"
        href="https://www.chaibuilder.com">
        <Image
          src={"https://ucarecdn.com/fbfc3b05-cb73-4e99-92a2-3a367b7c36cd/"}
          alt=""
          loading="lazy"
          width="40"
          height="40"
          decoding="async"
          data-nimg="1"
          className="w-8 h-8 text-primary-400 dark:text-primary-300 rounded"
        />
        <span className="ml-2 text-xl font-bold tracking-wide text-gray-800 uppercase dark:text-gray-100">
          Chai Builder
        </span>
      </a>
      <div className="text-center -mt-8">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl font-pj">
          Authenticate
        </h1>
        <br />
        <p className="text-gray-400 text-sm font-light">
          NOTE: Implement your own authentication in `useBuilderAuth` hook
          <br />
          File: `@/hooks/use-builder-auth.ts`
        </p>
      </div>

      <button
        role="button"
        onClick={login}
        disabled={loading || isLoggedIn}
        className={
          "border p-2 px-4 flex items-center space-x-2 rounded hover:bg-slate-100 duration-300 shadow-lg"
        }>
        <span> Login Now</span>
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {/* <Toaster /> */}
    </section>
  );
}
