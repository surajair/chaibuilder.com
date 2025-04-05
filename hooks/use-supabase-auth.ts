import { supabase } from "@/chai/supabase";
import { useFetch } from "@chaibuilder/pages";
import { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface UseSupabaseAuthReturn {
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}

const checkUserActive = async (fetchApi: any, user: User) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  try {
    const response = await fetch("/chai/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({
        action: "CHECK_USER_STATUS",
        data: { userId: user.id },
      }),
    });
    console.log("response user active", response);
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
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fetchApi = useFetch();

  // Monitor the authentication state
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_: AuthChangeEvent, session: Session | null) => {
        if (session?.user) {
          // Check if user is active after sign-in
          if (await checkUserActive(fetchApi, session.user)) {
            setUser(session.user);
          } else {
            toast.error(
              "Your account is not active. Please request access from your admin."
            );
            await supabase.auth.signOut();
            setUser(null);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Get current session on mount
    const getCurrentUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        // Check if user is active on initial load
        if (await checkUserActive(fetchApi, session.user)) {
          setUser(session.user);
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

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [fetchApi]);

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

  console.log("user", user);
  let userInfo = {
    authToken: accessToken,
    id: user?.id,
    name: user?.user_metadata.name,
    email: user?.email,
    photoURL: user?.user_metadata.avatar_url,
  };
  //@ts-ignore
  return { user: userInfo, login, logout, isLoggedIn, loading, error };
};

export { useSupabaseAuth };
