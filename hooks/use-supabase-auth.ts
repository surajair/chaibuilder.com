import { supabase } from "@/hooks/supabase";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export type ChaiUser = {
  id: string;
  name: string;
  email: string;
  authToken: string;
  avatar?: string;
};

interface UseSupabaseAuthReturn {
  user: ChaiUser | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}

const checkUserActive = async (userId: string) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  try {
    const response = await fetch("/chai/api?action=check_user_status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({
        action: "CHECK_USER_STATUS",
        data: { userId },
      }),
    });
    return response.status === 200;
  } catch (error) {
    console.error("Error checking user active", error);
    return false;
  }
};

/**
 * @description
 * useSupabaseAuth hook provides functionality for user authentication with Google.
 * It returns an object containing the current user, login and logout functions,
 * a boolean indicating whether the user is logged in, a boolean indicating
 * whether the authentication process is currently loading, and an error message.
 */
const useSupabaseAuth = (): UseSupabaseAuthReturn => {
  const [user, setUser] = useState<ChaiUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Monitor the authentication state
  useEffect(() => {
    // Get current session on mount
    const getCurrentUser = async () => {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        // Check if user is active on initial load
        if (await checkUserActive(session.user.id)) {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata.name,
            email: session.user.email as string,
            authToken: session.access_token,
          });
          setAccessToken(session.access_token);
        } else {
          toast.error(
            "Your account is not active. Please request access from your admin."
          );
          await supabase.auth.signOut();
          setUser(null);
          setAccessToken(null);
        }
      }
      setLoading(false);
    };

    getCurrentUser();
  }, []);

  // Login with Google
  const login = async () => {
    setLoading(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/chai`
              : undefined,
        },
      });
      // Auth state is handled in the onAuthStateChange listener
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setLoading(false);
    }
  };

  // Logout the user
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      window.location.reload();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  // Check if the user is logged in
  const isLoggedIn = user !== null;

  let userInfo = {
    authToken: accessToken as string,
    id: user?.id as string,
    name: user?.name as string,
    email: user?.email as string,
    avatar: user?.avatar as string,
  };

  return { user: userInfo, login, logout, isLoggedIn, loading, error };
};

export { useSupabaseAuth };
