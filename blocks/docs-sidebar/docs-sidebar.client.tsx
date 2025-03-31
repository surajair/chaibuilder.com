"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface DocLink {
  title: string;
  href?: string;
  items?: DocLink[];
}

interface DocsSidebarProps {
  links: DocLink[];
  className?: string;
}

export function DocsSidebarClient({ links, className }: DocsSidebarProps) {
  return (
    <div
      className={cn(
        "w-full h-full overflow-auto border-r bg-background",
        className
      )}>
      <div className="py-2">
        {links.map((section, i) => (
          <div key={i} className="px-3 py-2">
            {section.title && (
              <h4 className="mb-1 text-sm font-medium text-muted-foreground">
                {section.title}
              </h4>
            )}
            <div className="space-y-1">
              {section.items?.map((item, j) => <NavItem key={j} item={item} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface NavItemProps {
  item: DocLink;
  level?: number;
}

function NavItem({ item, level = 0 }: NavItemProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const isActive = item.href ? pathname === item.href : false;
  const hasChildren = item.items && item.items.length > 0;

  React.useEffect(() => {
    if (hasChildren) {
      const isChildActive = item.items?.some(
        (child) => child.href && pathname === child.href
      );
      if (isChildActive) {
        setOpen(true);
      }
    }
  }, [pathname, hasChildren, item.items]);

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
        {open && (
          <div className="ml-4 space-y-1">
            {item.items?.map((child, index) => (
              <NavItem key={index} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href || "#"}
      className={cn(
        "block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
        isActive ? "bg-accent text-accent-foreground" : "transparent"
      )}>
      {item.title}
    </Link>
  );
}
