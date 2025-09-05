"use client";

import { PageContainer } from "@/components/page-container";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { toggleArchived, deleteEmail, toggleStarred } from "@/services/db";
import { ArchiveRestore, Archive, Trash2, ArrowLeft, Star } from "lucide-react";
import {
  startTransition,
  use,
  useEffect,
  useState,
  useTransition,
} from "react";
import { getEmailById } from "@/services/db";
import { EmailRegister } from "@/interfaces/email-register";
import { dbEvents } from "@/helpers/db-events";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function EmailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState<EmailRegister | undefined>(undefined);

  const loadEmails = () => {
    startTransition(() => {
      getEmailById(id).then(setEmail);
    });
  };

  const actions = {
    onArchive: async ({ id }: { id: string }) => {
      await toggleArchived(id);
    },
    onDelete: async ({ id }: { id: string }) => {
      await deleteEmail(id);
    },
    onStarred: async ({ id }: { id: string }) => {
      await toggleStarred(id);
    },
  };

  useEffect(() => {
    loadEmails();

    const reload = () => loadEmails();

    dbEvents.addEventListener("email.created", reload);
    dbEvents.addEventListener("email.updated", reload);
    dbEvents.addEventListener("email.deleted", reload);

    return () => {
      dbEvents.removeEventListener("email.created", reload);
      dbEvents.removeEventListener("email.updated", reload);
      dbEvents.removeEventListener("email.deleted", reload);
    };
  }, []);

  return (
    <PageContainer>
      <div className="flex justify-between items-center">
        <div className="items-center gap-2 flex">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 cursor-pointer"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Voltar</p>
            </TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 cursor-pointer"
                onClick={() => actions.onArchive({ id })}
              >
                <span className="sr-only">Arquivar</span>
                {email?.archived ? (
                  <ArchiveRestore className="h-4 w-4" />
                ) : (
                  <Archive className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{email?.archived ? "Restaurar" : "Arquivar"}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 cursor-pointer"
                onClick={() => actions.onDelete({ id })}
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
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 cursor-pointer"
              onClick={() => actions.onStarred({ id })}
            >
              <span className="sr-only">Favoritar</span>
              <Star
                className="h-4 w-4"
                fill={email?.starred ? "currentColor" : "none"}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Favoritar</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="mt-12">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-bold text-base mb-6">{email?.subject}</p>
            <p className="text-sm">{email?.body}</p>
          </div>
          {email?.sendDate && (
            <span className="text-xs text-muted-foreground">
              {format(new Date(email.sendDate), "PPpp", { locale: ptBR })}
            </span>
          )}
        </div>

        <Separator className="my-12" />

        <div className="flex items-center gap-2 mb-4">
          <Avatar>
            <AvatarFallback>IA</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-bold">TurboMailler</p>
            <p className="text-xs">contato@turbomailler.com.br</p>
          </div>
        </div>
        <p className="text-sm">{email?.suggested_response}</p>
      </div>
    </PageContainer>
  );
}
