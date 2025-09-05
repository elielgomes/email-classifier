"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Loader2,
  Maximize2,
  Minimize2,
  Minus,
  Paperclip,
  Send,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { sendEmail } from "@/services/send-email";

interface Attachment {
  id: string;
  name: string;
  size: number;
  file: File;
}

export function GmailComposer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | undefined>(
    undefined
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // valida extensão
    const validTypes = ["application/pdf", "text/plain"];
    if (!validTypes.includes(file.type)) {
      toast.warning("Somente arquivos PDF ou TXT são permitidos.");
      event.target.value = "";
      return;
    }

    // substitui qualquer anexo existente
    const newAttachment: Attachment = {
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      file,
    };
    setAttachment(newAttachment);
  };

  const removeAttachment = () => {
    setAttachment(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // reset input
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const handleSend = async () => {
    setIsLoading(true);
    try {
      await sendEmail({
        subject,
        body,
        attachment: attachment?.file,
      });

      toast.success("Email enviado com sucesso!");

      setSubject("");
      setBody("");
      setAttachment(undefined);
      setIsOpen(false);
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Erro ao enviar email.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    setIsMaximized(false);
  };

  const handleClose = () => {
    if (isLoading) return; // prevent closing while loading
    setIsOpen(false);
    setIsMinimized(false);
    setIsMaximized(false);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg"
      >
        <Send className="w-5 h-5 mr-2" />
        Escrever
      </Button>
    );
  }

  return (
    <>
      {/* Overlay for maximized mode */}
      {isMaximized && <div className="fixed inset-0 bg-black/50 z-40" />}

      <Card
        className={cn(
          "fixed z-50 shadow-2xl border border-border transition-all duration-200 pt-0",
          isMaximized
            ? "inset-4"
            : isMinimized
            ? "bottom-0 right-6 w-80 h-10 p-0"
            : "bottom-0 right-6 w-[500px] h-[600px]"
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex items-center justify-between border-b bg-muted/30",
            isMinimized ? "px-3 h-10" : "p-3"
          )}
        >
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-foreground">
              {isMinimized ? "Nova mensagem" : "Nova mensagem"}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleMinimize()}
              className="h-6 w-6 p-0 hover:bg-muted"
            >
              <Minus className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleMaximize()}
              className="h-6 w-6 p-0 hover:bg-muted"
            >
              {isMaximized ? (
                <Minimize2 className="w-3 h-3" />
              ) : (
                <Maximize2 className="w-3 h-3" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleClose()}
              className="h-6 w-6 p-0 hover:bg-muted"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Content - hidden when minimized */}
        {!isMinimized && (
          <div className="flex flex-col h-full">
            {/* Recipients */}
            <div className="p-3 border-b">
              <Input
                value={subject}
                onChange={(e) => {
                  if (e.target.value.length <= 100) {
                    setSubject(e.target.value);
                  }
                }}
                placeholder="Assunto"
                className="border-0 shadow-none focus-visible:ring-0"
              />
            </div>

            {/* Toolbar */}
            <div className="flex items-center space-x-1 p-2 border-b bg-muted/20">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="p-0"
              >
                <Paperclip className="w-4 h-4" />
                Anexar arquivo
              </Button>
            </div>

            {/* Message Body */}
            <div className="flex-1 flex flex-col gap-2 p-3">
              <Textarea
                value={body}
                onChange={(e) => {
                  if (e.target.value.length <= 1000) {
                    setBody(e.target.value);
                  }
                }}
                placeholder="Escrever mensagem"
                className="w-full h-full border-0 shadow-none focus-visible:ring-0 resize-none text-sm"
              />
              <div className="text-xs text-muted-foreground flex justify-end">
                {body.length}/1000
              </div>
            </div>

            {/* Attachment */}
            {attachment && (
              <div className="p-3 border-t bg-muted/20">
                <div className="flex items-center justify-between bg-muted p-2 rounded border">
                  <div className="flex items-center space-x-2">
                    <Paperclip className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{attachment.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({formatFileSize(attachment.size)})
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeAttachment}
                    className="h-6 w-6 p-0 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between p-3 border-t">
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleSend}
                  disabled={!subject || !body || isLoading}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
                >
                  {isLoading && <Loader2 className="animate-spin mr-2" />}
                  {!isLoading && <Send className="w-4 h-4 mr-2" />}
                  {isLoading ? "Enviando..." : "Enviar"}
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground"
              >
                Descartar
              </Button>
            </div>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleAttachment}
          className="hidden"
        />
      </Card>
    </>
  );
}
