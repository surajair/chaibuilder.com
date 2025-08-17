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
import { Trash2 } from "lucide-react";
import { useActionState } from "react";
import { deleteDomain } from "@/app/(dashboard)/websites/website/[websiteId]/details/actions";

interface DeleteDomainModalProps {
  websiteId: string;
  domain: string;
}

function DeleteDomainModal({ websiteId, domain }: DeleteDomainModalProps) {
  const [deleteDomainState, deleteDomainAction, deleteDomainPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await deleteDomain(formData);
      return result;
    },
    { success: false },
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Domain</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove &lsquo;{domain}&rsquo; from this website? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form action={deleteDomainAction}>
            <input type="hidden" name="websiteId" value={websiteId} />
            <input type="hidden" name="domain" value={domain} />
            <AlertDialogAction
              type="submit"
              disabled={deleteDomainPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteDomainPending ? "Deleting..." : "Delete Domain"}
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

DeleteDomainModal.displayName = "DeleteDomainModal";

export default DeleteDomainModal;
