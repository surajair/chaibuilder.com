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

const SiteDetailModal = () => {};

const SiteDeleteModal = () => {};

export const SiteMenu = ({ site }: { site: any }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
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
    </>
  );
};
