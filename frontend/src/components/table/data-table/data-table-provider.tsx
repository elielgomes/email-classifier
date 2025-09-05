"use client";

import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  RowData,
  Table as TanStackTable,
  useReactTable,
} from "@tanstack/react-table";
import { createContext, ReactNode, useContext, useState } from "react";

export interface DataTableProps<TData extends RowData, TValue> {
  isLoading?: boolean;
  children: ReactNode;
  columns: ColumnDef<TData, TValue>[];
  data?: TData[];
}

type TableInstanceType<TData extends RowData> = TanStackTable<TData> & {
  isLoading?: boolean;
};

const DataTableContext = createContext<TableInstanceType<any> | undefined>(
  undefined
);

export function DataTableProvider<TData extends RowData, TValue>({
  data = [],
  columns,
  children,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,

    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <DataTableContext.Provider value={{ ...table, isLoading }}>
      <div className="flex flex-col gap-4 overflow-auto">{children}</div>
    </DataTableContext.Provider>
  );
}

export function useDataTable<
  TData extends RowData
>(): TableInstanceType<TData> {
  const ctx = useContext(DataTableContext);
  if (!ctx) {
    throw new Error("useDataTable must be used within a DataTable provider");
  }
  return ctx as TableInstanceType<TData>;
}
