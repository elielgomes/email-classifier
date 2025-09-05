import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useDataTable } from "./data-table-provider";

export function DataTableBodyLoading() {
	const table = useDataTable();
	const columnCount = table.getAllColumns().length;
	const rowCount = table.getState().pagination?.pageSize || 20;

	return (
		<TableBody className="**:data-[slot=table-cell]:last:w-24">
			{Array.from({ length: rowCount }).map((_, index) => (
				<TableRow key={`loading-row-${index}`} className="animate-pulse">
					{Array.from({ length: columnCount }).map((__, colIndex) => (
						<TableCell key={`loading-cell-${index}-${colIndex}`}>
							<div className="h-4 bg-muted rounded w-full p-4" />
						</TableCell>
					))}
				</TableRow>
			))}
		</TableBody>
	);
}
