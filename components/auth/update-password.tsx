"use client";

import { Button, Input, Label } from "@chaibuilder/sdk/ui";
import { useState } from "react";
import { updatePassword } from "@/actions/user-auth-action";
import { toast } from "sonner";
import Link from "next/link";
import { EyeIcon, EyeClosed } from "lucide-react";

export default function UpdatePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-right",
      });
      return;
    }

    // Validate password length
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long", {
        position: "top-right",
      });
      return;
    }

    setIsLoading(true);

    try {
      await updatePassword(newPassword);
      setIsSubmitted(true);
      toast.success("Password updated successfully!", {
        position: "top-right",
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update password",
        {
          position: "top-right",
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-4 text-center">
        <h2 className="text-normal font-semibold">Password Updated</h2>
        <p className="text-muted-foreground">
          Your password has been successfully updated. You can now log in with
          your new password.
        </p>
        <br />
        <Link
          href="/login"
          className="w-full bg-fuchsia-800 hover:bg-fuchsia-700 text-white font-medium py-2 px-16 rounded"
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="new-password">New Password</Label>
          <div className="relative">
            <Input
              id="new-password"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="border-gray-300"
              placeholder="New Password"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 w-8 hover:bg-transparent hover:text-gray-500"
              onClick={(e) => {
                e.preventDefault();
                setShowPassword(!showPassword);
              }}
            >
              {showPassword ? <EyeIcon /> : <EyeClosed />}
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm New Password</Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="border-gray-300"
              placeholder="Confirm New Password"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                setShowConfirmPassword(!showConfirmPassword);
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-8 hover:bg-transparent hover:text-gray-500"
            >
              {showConfirmPassword ? <EyeIcon /> : <EyeClosed />}
            </Button>
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-fuchsia-800 hover:bg-fuchsia-700"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </>
  );
}
