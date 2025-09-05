import {
  Archive,
  Inbox,
  Star,
  type LucideIcon
} from "lucide-react";

export interface SidebarItem {
	title: string;
	url: string;
	icon?: LucideIcon;
}

export const sidebarItems = [
	{
		title: "Caixa de entrada",
		url: "/",
		icon: Inbox,
	},
  {
    title: "Com estrela",
    url: "/starred",
    icon: Star,
  },
  {
    title: "Arquivados",
    url: "/archived",
    icon: Archive,
  },
] as const satisfies SidebarItem[];
