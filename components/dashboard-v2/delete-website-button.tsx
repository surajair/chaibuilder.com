"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useActionState } from "react";
import { deleteWebsite } from "@/app/(dashboard)/websites/website/[websiteId]/details/actions";

interface DeleteWebsiteButtonProps {
  websiteId: string;
  siteData: {
    id: any;
    name: any;
    createdAt: any;
    fallbackLang: any;
    languages: any;
    app_api_keys: { apiKey: any; }[];
  };
}

function DeleteWebsiteButton({ websiteId, siteData }: DeleteWebsiteButtonProps) {
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const [deleteState, deleteAction, deletePending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await deleteWebsite(formData);
      return result;
    },
    { success: false },
  );

  return (
    <section className="pt-8">
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Permanently delete this website and all of its data</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Website</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your website and remove all data from our
                  servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <form action={deleteAction}>
                <input type="hidden" name="websiteId" value={websiteId} />
                <div className="space-y-2">
                  <Label htmlFor="delete-confirm">Type &lsquo;DELETE&lsquo; to confirm</Label>
                  <Input
                    id="delete-confirm"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder="DELETE"
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setDeleteConfirmation("")}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    type="submit"
                    disabled={deleteConfirmation !== "DELETE" || deletePending}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    {deletePending ? "Deleting..." : "Delete Website"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </form>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </section>
  );
}

DeleteWebsiteButton.displayName = "DeleteWebsiteButton";

export default DeleteWebsiteButton;
