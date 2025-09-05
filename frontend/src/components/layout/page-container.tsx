import { cn } from "@/lib/utils";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function PageContainer({
  children,
  className,
  ...props
}: PageContainerProps) {
  return (
    <div
      {...props}
      className={cn("p-6 lg:p-8 flex-1 bg-card rounded-sm", className)}
    >
      {children}
    </div>
  );
}
