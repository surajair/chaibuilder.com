"use client";

import { useBuilderAuth } from "@/hooks/use-builder-auth";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@chaibuilder/sdk/ui";
import { LogOut, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function UserAvatarMenu() {
  const { user, logout } = useBuilderAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [img, setImg] = useState<string | null>(null);

  useEffect(() => {
    if (user?.photoURL) {
      const img = new window.Image();
      img.onload = () => setImg(user.photoURL);
      img.src = user.photoURL;
    }
  }, [user?.photoURL]);

  const name = user?.name;

  const handleSignOut = () => {
    setIsDialogOpen(true);
  };

  const confirmSignOut = () => {
    setIsDialogOpen(false);
    logout();
  };

  return (
    <>
      <Tooltip delayDuration={100}>
        <TooltipTrigger className="cursor-pointer">
          {img ? (
            <Image
              alt="user avatar"
              src={img}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white">
              {name?.charAt(0)}
            </div>
          )}
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-white border shadow-xl text-slate-800 p-4">
          <div className="">
            <div className="flex items-center space-x-2">
              {img ? (
                <Image
                  alt="user avatar"
                  src={img}
                  width={16}
                  height={16}
                  className="rounded-full"
                />
              ) : (
                <User className="h-4 w-4" />
              )}
              <span className="font-medium ">{name}</span>
            </div>
            {user?.email && (
              <div className="text-xs text-muted-foreground">{user?.email}</div>
            )}
            <Button
              size="sm"
              variant="outline"
              className="w-full leading-tight text-red-500 hover:text-red-500 mt-2 flex items-center gap-x-1"
              onClick={handleSignOut}>
              <LogOut className="h-3.5 w-3.5 stroke-[2]" />
              <span className="-mt-px">Sign Out</span>
            </Button>
          </div>
        </TooltipContent>
      </Tooltip>

      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure you want to sign out?</DialogTitle>
              <DialogDescription>
                You will be logged out of your account.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmSignOut}>
                Sign out
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
