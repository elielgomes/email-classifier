import { cn } from "@/lib/utils";

interface DataTableToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
}

export function DataTableToolbar({
	children,
	className,
}: DataTableToolbarProps) {
	return <div className={cn("w-full flex gap-2", className)}>{children}</div>;
}
