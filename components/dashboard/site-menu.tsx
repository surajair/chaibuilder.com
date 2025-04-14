"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@chaibuilder/sdk/ui";
import { ConfirmDialog } from "./confirm-dialog";
import { deleteSite } from "@/actions/delete-site-action";
import { Site } from "@/utils/types";
import { toast } from "sonner";
import { SiteDetailsModal } from "./site-detail-modal";

const SiteDetailModal = () => {};

export const SiteMenu = ({ site }: { site: Site }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteSite(site.id);
      toast.success("Website deleted successfully");
    } catch (error) {
      toast.error("Failed to delete website.");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-gray-100"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white cursor-pointer">
          <DropdownMenuItem
            onClick={() => setShowDetailsModal(true)}
            className="cursor-pointer hover:bg-gray-100"
          >
            Site Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDetailsModal(true)}
            className="cursor-pointer hover:bg-gray-100"
          >
            API Key
          </DropdownMenuItem>
          <DropdownMenuSeparator className="border-t" />
          <DropdownMenuItem
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-600 cursor-pointer hover:bg-gray-100"
          >
            Delete Site
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SiteDetailsModal
        site={site}
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        onUpdate={() => {}}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Site"
        description={`Are you sure you want to delete "${site.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
      />
    </>
  );
};
