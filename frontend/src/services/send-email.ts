import { EmailCategory } from "@/enums/email-category";
import { api } from "./api";

import { addEmail } from "./db";


interface EmailResponse {
  category: EmailCategory;
  suggested_response: string;
}

export async function sendEmail({
  attachment,
  body,
  subject,
}: {
  subject: string;
  body: string;
  attachment?: File;
}) {
  const formData = new FormData();
  formData.append("subject", subject);
  formData.append("body", body);
  if (attachment) {
    formData.append("file", attachment);
  }

  try {
    const { data } = await api.post<EmailResponse>("/classify-email", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if(data.category && data.suggested_response) {
      addEmail({
        id: crypto.randomUUID(),
        subject,
        body,
        category: data.category,
        suggested_response: data.suggested_response,
        sendDate: new Date(),
        archived: false,
        starred: false,
        attachment: attachment,
      });
    }

    return data;

  } catch (error) {
    throw error;
  }
}
