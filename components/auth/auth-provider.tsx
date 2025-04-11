"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "../dashboard/loader";
import { supabase } from "@/hooks/supabase";
import { User } from "@supabase/supabase-js";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // * Fetching user
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) router.replace("/login");
      setLoading(false);
    })();
  }, [router]);

  if (loading && !pathname.includes("/login")) return <Loader />;

  return children;
}
