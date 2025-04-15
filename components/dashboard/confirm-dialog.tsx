"use client";

import {
  Dialog,
  // DialogAction,
  // DialogCancel,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@chaibuilder/sdk/ui";
import { Button } from "../ui/button";
import { useState } from "react";
import Loader from "./loader";

interface ConfirmDialogProps {
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
}

export function ConfirmDialog({
  onOpenChange,
  title,
  description,
  onConfirm,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  const onClickConfirm = async () => {
    setLoading(true);
    await onConfirm?.();
    setLoading(false);
  };

  const handleStateChange = (newState: boolean) => {
    if (!loading) onOpenChange(newState);
  };

  return (
    <Dialog open={true} onOpenChange={handleStateChange}>
      <DialogContent className={`z-[999]`}>
        {loading && <Loader />}
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={(e) => handleStateChange(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={onClickConfirm} className="bg-red-600 hover:bg-red-">
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
