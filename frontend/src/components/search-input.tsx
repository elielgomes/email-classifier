"use client";

import { Search as SearchIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
	handleClear?: () => void;
	onChange: (value: string) => void;
}

export function SearchInput({
	className,
	placeholder = "Buscar...",
	value,
	onChange,
	handleClear,
	...props
}: SearchInputProps) {
	const clearValue = () => {
		if (handleClear) {
			handleClear();
		} else {
			onChange("");
		}
	};

	return (
		<div className="relative w-full">
			<SearchIcon className="size-4 shrink-0 opacity-50 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />

			<Input
				placeholder={placeholder}
				className={cn("h-8 pl-8 pr-8", className)}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				{...props}
			/>

			{value?.toString().trim() !== "" && (
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={clearValue}
					className="absolute right-1 top-1/2 -translate-y-1/2 rounded-sm size-6 hover:bg-muted"
					aria-label="Limpar busca"
				>
					<X className="size-4 shrink-0 opacity-50" />
				</Button>
			)}
		</div>
	);
}
