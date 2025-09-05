import { openDB } from "idb";
import { EmailRegister } from "@/interfaces/email-register";
import { emitDbEvent } from "@/helpers/db-events";
import { EmailCategory } from "@/enums/email-category";

const DB_NAME = "emailDB";
const STORE_NAME = "emails";

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });
}

export async function addEmail(email: EmailRegister) {
  const db = await initDB();
  await db.put(STORE_NAME, email);
  emitDbEvent("email.created", email);
}

export async function getEmails(): Promise<EmailRegister[]> {
  const db = await initDB();
  return await db.getAll(STORE_NAME);
}

export async function getEmailById(id: string): Promise<EmailRegister | undefined> {
  const db = await initDB();
  return await db.get(STORE_NAME, id);
}

export async function updateEmail(email: EmailRegister) {
  const db = await initDB();
  await db.put(STORE_NAME, email);
  emitDbEvent("email.updated", email);
}

export async function deleteEmail(id: string) {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
  emitDbEvent("email.deleted", id);
}

export async function toggleStarred(id: string) {
  const db = await initDB();
  const email = await db.get(STORE_NAME, id);
  if (email) {
    email.starred = !email.starred;
    await db.put(STORE_NAME, email);
    emitDbEvent("email.updated", email);
  }
}

export async function toggleArchived(id: string) {
  const db = await initDB();
  const email = await db.get(STORE_NAME, id);
  if (email) {
    const willArchive = !email.archived;

    email.archived = willArchive;

    if (willArchive) {
      email.starred = false;
    }

    await db.put(STORE_NAME, email);
    emitDbEvent("email.updated", email);
  }
}


export async function getEmailsFiltered(options?: {
  category?: EmailCategory;
  starred?: boolean;
  search?: string;
  archived?: boolean;
}): Promise<EmailRegister[]> {
  const db = await initDB();
  let emails = await db.getAll(STORE_NAME);

  emails = emails.sort((a, b) => b.sendDate.getTime() - a.sendDate.getTime());

  if (options?.category) {
    emails = emails.filter((e) => e.category === options.category);
  }

  if (options?.starred !== undefined) {
    emails = emails.filter((e) => e.starred === options.starred);
  }

  if (options?.search) {
    emails = emails.filter((e) =>
      e.subject.toLowerCase().includes(options.search?.toLowerCase())
    );
  }

  if (options?.archived !== undefined) {
    emails = emails.filter((e) => e.archived === options.archived);
  }

  return emails;
}
