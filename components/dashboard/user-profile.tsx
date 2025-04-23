"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@chaibuilder/sdk/ui";
import { supabase } from "@/chai/supabase";
import { useRouter } from "next/navigation";
import Loader from "./loader";
import { Info } from "lucide-react";

export function UserProfile({ user }: { user: User }) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async (e: any) => {
    e.preventDefault();

    try {
      setIsSigningOut(true);
      await supabase.auth.signOut();
      router.replace("/login");
    } catch (error) {
      console.error("Failed to sign out:", error);
      setIsSigningOut(false);
    }
  };

  return (
    <>
      {!user?.user_metadata?.hasPassword && (
        <div className="border border-gray-500 text-gray-500 rounded-md py-1 pl-2 pr-1 flex items-center gap-8">
          <span className="text-gray-600 text-sm flex items-center gap-2">
            <Info className="w-4 h-4" />
            Please set a your password
          </span>
          <Button
            variant="default"
            size="sm"
            className="p-2 py-0 h-7 text-xs"
            onClick={() => router.push("/update-password?type=set")}
          >
            Set password
          </Button>
        </div>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative rounded-full p-0 h-max pl-2 border border-transparent hover:border-gray-100"
          >
            <span className="ml-1 leading-tight hidden sm:block">
              {user.user_metadata.name || user.email}
            </span>
            <Avatar className="h-7 w-7 border-2 text-xs bg-gray-100">
              <AvatarImage
                src={user.user_metadata.avatar_url}
                alt={user.user_metadata.full_name || ""}
              />
              <AvatarFallback>
                {user?.user_metadata?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium">{user.user_metadata.full_name}</p>
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push("/update-password")}
            disabled={isSigningOut}
          >
            Change Password
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer hover:bg-gray-100 text-red-800"
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <>
                <Loader fullscreen={false} />
                Signing out...
              </>
            ) : (
              "Sign out"
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
