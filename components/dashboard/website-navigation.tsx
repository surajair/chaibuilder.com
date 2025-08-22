"use client";

import { FileText, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { id: "formSubmissions", label: "Form submissions", icon: FileText, href: "/form-submission" },
  { id: "details", label: "Website details", icon: Settings, href: "/details" },
];

interface WebsiteNavigationProps {
  websiteId: string;
}

export function WebsiteNavigation({ websiteId }: WebsiteNavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-1 h-12">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const href = `/websites/website/${websiteId}${item.href}`;
        const isActive = pathname === href || (pathname.startsWith(href) && href !== "/website/" + websiteId);

        return (
          <Link
            key={item.id}
            href={href}
            className={`flex items-center gap-2 px-5 py-2 text-sm font-medium border-b-2 transition-colors ${
              isActive
                ? "border-primary text-primary"
                : "border-primary/10 text-muted-foreground hover:text-foreground hover:border-muted-foreground"
            }`}>
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
