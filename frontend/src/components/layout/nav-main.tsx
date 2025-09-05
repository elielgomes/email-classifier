"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarItem } from "@/constants/sidebar-items";
import { useActivePath } from "@/hooks/use-active-path";
import Link from "next/link";
import { Fragment } from "react";

export function NavMain({ items }: { items: SidebarItem[] }) {
  const { isActive } = useActivePath();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Links</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isItemActive = isActive(item.url);

          return (
            <Fragment key={item.title}>
              <SidebarMenuItem>
                <Link href={item.url}>
                  <SidebarMenuButton
                    isActive={isItemActive}
                    tooltip={item.title}
                    className="cursor-pointer"
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </Fragment>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
