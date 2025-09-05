"use client";

import { NavMain } from "@/components/layout/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { sidebarItems } from "@/constants/sidebar-items";
import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";
import * as React from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div
          className={cn(
            "group-data-[state='expanded']:p-2 group-data-[state='collapsed']:px-0 group-data-[state='collapsed']:py-2",
            isMobile && "p-3"
          )}
        >
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-md bg-muted flex items-center justify-center">
              <Mail className="size-5" />
            </div>
            <span className="font-bold text-xl group-data-[state='expanded']:block group-data-[state='collapsed']:hidden">
              TurboMailler
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarItems} />
      </SidebarContent>
    </Sidebar>
  );
}
