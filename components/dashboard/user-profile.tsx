"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/hooks/supabase";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export function UserProfile() {
  const router = useRouter();
  const [user, setUser] = useState<User>({} as User);

  useEffect(() => {
    // * Fetching user
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) router.replace("/login");
      setUser(user as User);
    })();
  }, [router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  // Get first letter of name for avatar fallback
  const getInitials = () => {
    const name = user?.user_metadata?.full_name || "U";
    return name.charAt(0).toUpperCase();
  };

  if (!user || !user?.user_metadata) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-1 p-1">
          <Avatar className="h-7 w-7 border-2 text-xs bg-gray-100">
            <AvatarImage
              src={user.user_metadata.avatar_url}
              alt={user.user_metadata.full_name || ""}
            />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          <span className="ml-1 leading-tight">
            {user.user_metadata.full_name || user.email}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="bg-white rounded-md overflow-hidden"
      >
        <DropdownMenuItem
          onClick={signOut}
          className="cursor-pointer hover:bg-gray-50 text-xs rounded-md"
        >
          <LogOut className="mr-1" size={3} strokeWidth={1} />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
