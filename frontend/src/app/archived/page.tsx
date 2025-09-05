"use client";

import { PageContainer } from "@/components/page-container";
import { emailColumns } from "@/components/table/columns/email-table-columns";
import {
  DataTablePagination,
  DataTableProvider,
  DataTableTable,
  DataTableToolbar,
} from "@/components/table/data-table";
import {
  EmailTableFilters,
  useEmailTableFilters,
} from "@/components/table/filters/email-table-filters";
import { dbEvents } from "@/helpers/db-events";
import { EmailRegister } from "@/interfaces/email-register";
import {
  deleteEmail,
  getEmailsFiltered,
  toggleArchived,
  toggleStarred,
} from "@/services/db";
import { useRouter } from "next/navigation";
import {  useEffect, useState, useTransition } from "react";

export default function Archived() {
  const [emails, setEmails] = useState<EmailRegister[]>([]);
  const [isPending, startTransition] = useTransition();
  const { tableFilters } = useEmailTableFilters();
	const router = useRouter();

  const loadEmails = () => {
    startTransition(() => {
      getEmailsFiltered({
        search: tableFilters.filters.search,
        archived: true,
      }).then(setEmails);
    });
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
  }, [tableFilters.filters]);

  const columns = emailColumns({
    onArchive: async ({ id }) => {
      await toggleArchived(id);
    },
    onDelete: async ({ id }) => {
      await deleteEmail(id);
    },
    onStarred: async ({ id }) => {
      await toggleStarred(id);
    },
  }, false);

  return (
    <PageContainer>
      <DataTableProvider columns={columns} data={emails} isLoading={isPending}>
        <DataTableToolbar className="flex items-center justify-between">
          <EmailTableFilters
            isLoading={isPending}
            isRefetching={isPending}
            onRefresh={loadEmails}
            tableFilters={tableFilters}
          />
        </DataTableToolbar>
        <DataTableTable onRowClick={(row: EmailRegister) => router.push(`/emails/${row.id}`)} />
        <DataTablePagination />
      </DataTableProvider>
    </PageContainer>
  );
}
