"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { emailCategoryDescription } from "@/dictionaries/email-category-description";
import { EmailCategory } from "@/enums/email-category";
import { EmailRegister } from "@/interfaces/email-register";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Archive, ArchiveRestore, Star, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export type EmailColumns = EmailRegister;

interface EmailColumnActions {
  onStarred: ({ id }: { id: string }) => void;
  onArchive: ({ id }: { id: string }) => void;
  onDelete: ({ id }: { id: string }) => void;
}

export const emailColumns = (
  actions: EmailColumnActions,
  showStarred = true
): ColumnDef<EmailColumns>[] => {
  const columns: ColumnDef<EmailColumns>[] = [];

	 if (showStarred) {
    columns.push({
      id: "starred",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 cursor-pointer"
                onClick={() => actions.onStarred({ id: row.original.id })}
              >
                <span className="sr-only">Favoritar</span>
                <Star
                  className="h-4 w-4"
                  fill={row.original.starred ? "currentColor" : "none"}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Favoritar</p>
            </TooltipContent>
          </Tooltip>
        </div>
      ),
    });
  }


	columns.push(
    {
      id: "subject",
      cell: ({ row }) => {
        const email = row.original;
        return (
          <div className="flex items-center gap-2">
            <span>{email.subject}</span>
          </div>
        );
      },
    },
    {
      id: "body",
      cell: ({ row }) => {
        const email = row.original;
        return (
          <div className="flex items-center gap-2">
            <span>{email.body}</span>
          </div>
        );
      },
    },
    {
      id: "category",
      cell: ({ row }) => {
        const email = row.original;
        const style =
          email.category === EmailCategory.PRODUCTIVE
            ? "border-green-500 text-green-500"
            : "border-yellow-500 text-yellow-500";
        return (
          <div className="flex items-center gap-2">
            <Badge className={cn("px-1.5 capitalize", style)} variant="outline">
              {emailCategoryDescription[email.category]}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const sendDate = new Date(row.original.sendDate);

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const startOfTomorrow = new Date(startOfToday);
        startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
        const isRecent = sendDate >= startOfToday && sendDate < startOfTomorrow;

        return (
          <div className="h-8 w-44 flex justify-end items-center">
            <div className="items-center gap-2 hidden group-hover/table-row:flex">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 cursor-pointer"
                    onClick={() => actions.onArchive({ id: row.original.id })}
                  >
                    <span className="sr-only">Arquivar</span>
                    {row.original.archived ? (
                      <ArchiveRestore className="h-4 w-4" />
                    ) : (
                      <Archive className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{row.original.archived ? "Restaurar" : "Arquivar"}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 cursor-pointer"
                    onClick={() => actions.onDelete({ id: row.original.id })}
                  >
                    <span className="sr-only">Excluir</span>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Excluir</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="group-hover/table-row:hidden">
              {isRecent && (
                <span className="text-xs text-muted-foreground">
                  {format(sendDate, "HH:mm", { locale: ptBR })}
                </span>
              )}

              {!isRecent && (
                <span className="text-xs text-muted-foreground">
                  {format(sendDate, "dd 'de' MMM", { locale: ptBR })}
                </span>
              )}
            </div>
          </div>
        );
      },
    },
	)
	return columns;
};
