import { emailCategoryDescription } from "@/dictionaries/email-category-description";
import { EmailCategory } from "@/enums/email-category";

export const emailCategoryFilterOptions = Object.entries(
	emailCategoryDescription,
).map(([key, label]) => ({
	value: key as EmailCategory,
	label,
}));
