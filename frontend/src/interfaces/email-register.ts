import { EmailCategory } from "@/enums/email-category";

export interface EmailRegister {
  id: string;
  subject: string;
  body: string;
  attachment?: File;
  category: EmailCategory;
  suggested_response?: string;
  starred: boolean;
  archived: boolean;
  sendDate: Date;
}