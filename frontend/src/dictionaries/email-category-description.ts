import { EmailCategory } from "@/enums/email-category";

export const emailCategoryDescription: Record<EmailCategory, string> = {
	[EmailCategory.PRODUCTIVE]: "Produtivo",
	[EmailCategory.UNPRODUCTIVE]: "Improdutivo",
};
