"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { cn } from "@/lib/utils";

export type DocLink = {
  title: string;
  href?: string;
  items?: DocLink[];
};

interface NavItemProps {
  item: DocLink;
  inBuilder?: boolean;
}

export function NavItem({ item, inBuilder }: NavItemProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const isActive = item.href ? pathname === item.href : false;
  const hasChildren = item.items && item.items.length > 0;

  if (hasChildren) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            open && "bg-accent/50"
          )}>
          {item.title}
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
          />
        </button>
        {open && item.items && (
          <div className="ml-4 pl-2 border-l">
            {item.items.map((child, index) => (
              <NavItem key={index} item={child} inBuilder={inBuilder} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      prefetch={true}
      href={inBuilder ? "#" : item.href || "#"}
      className={cn(
        "block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
        isActive ? "bg-accent text-accent-foreground" : "transparent"
      )}>
      {item.title}
    </Link>
  );
}
