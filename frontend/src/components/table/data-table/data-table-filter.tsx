"use client";

import { debounce } from "lodash";
import { Check, ChevronDown, CircleSmall, LucideIcon, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface FilterOption<T extends string | number = string> {
	label: string;
	value: T;
}

interface GenericFilterProps<T extends string | number = string> {
	options: FilterOption<T>[];
	selectedValues: T[];
	allowMultiSelect?: boolean;
	label?: string;
	className?: string;
	icon?: LucideIcon;
	emptyMessage?: string;
	searchPlaceholder?: string;
	disabled?: boolean;
	isLoading?: boolean;
	onSelectionChange: (values: T[]) => void;
	onSearch?: (query: string) => void | Promise<void>;
}

export function DataTableFilter<T extends string | number = string>({
	options,
	selectedValues,
	allowMultiSelect = false,
	label = "Filtrar",
	className = "",
	icon = CircleSmall,
	emptyMessage = "Nenhuma opção encontrada",
	searchPlaceholder = "Pesquisar...",
	disabled = false,
	isLoading = false,
	onSelectionChange,
	onSearch,
}: GenericFilterProps<T>) {
	const [isOpen, setIsOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");

	const handleSelectAll = () => {
		if (allowMultiSelect) {
			onSelectionChange(options.map((option) => option.value));
		}
	};

	const handleClearFilter = () => {
		onSelectionChange([]);
	};

	const handleSingleSelection = (value: T) => {
		onSelectionChange([value]);
		setIsOpen(false);
	};

	const handleMultiSelection = (value: T) => {
		const isSelected = selectedValues.includes(value);
		if (isSelected) {
			onSelectionChange(selectedValues.filter((v) => v !== value));
		} else {
			onSelectionChange([...selectedValues, value]);
		}
	};

	const getSelectedLabels = () => {
		return options
			.filter((option) => selectedValues.includes(option.value))
			.map((option) => option.label);
	};

	const getDisplayValue = () => {
		if (!hasSelection) return label;
		if (allowMultiSelect && selectedLabels.length > 1) {
			return `${selectedLabels[0]} (+${selectedLabels.length - 1})`;
		}
		return selectedLabels[0];
	};

	const selectedLabels = getSelectedLabels();
	const hasSelection = selectedValues.length > 0;
	const allSelected =
		allowMultiSelect && selectedValues.length === options.length;

	const Icon = icon;

	const handleSearch = useMemo(
		() => debounce((query: string) => onSearch?.(query), 500),
		[onSearch],
	);

	const handleOnSearch = (value: string) => {
		const trimmed = value.trim();
		setSearchValue(trimmed);

		if (!onSearch) return;

		if (trimmed === "") {
			handleSearch.cancel();
			onSearch("");
		} else {
			handleSearch(trimmed);
		}
	};

	return (
		<div className={`flex flex-col gap-2 ${className}`}>
			<Popover open={isOpen} onOpenChange={setIsOpen}>
				<PopoverTrigger asChild>
					<Button
						type="button"
						disabled={disabled}
						variant="outline"
						aria-expanded={isOpen}
						size="sm"
						className="justify-between min-w-32 h-8"
					>
						<div className="flex items-center gap-2">
							<Icon className="h-4 w-4" />
							<span className="truncate">{getDisplayValue()}</span>
						</div>
						<ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="p-0" align="center">
					<Command shouldFilter={!onSearch}>
						<div className="flex items-center justify-between p-3 pb-2">
							<h4 className="font-medium text-sm">{label}</h4>
							{hasSelection && (
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={handleClearFilter}
									className="h-auto p-1 text-xs"
								>
									<X className="h-3 w-3 mr-1" />
									Limpar
								</Button>
							)}
						</div>

						<div className="relative">
							<CommandInput
								className="h-9 pr-10"
								placeholder={searchPlaceholder}
								value={searchValue}
								onValueChange={handleOnSearch}
							/>
							{searchValue.trim() && (
								<Button
									type="button"
									onClick={() => handleOnSearch("")}
									variant="minimal"
									className="absolute right-2 top-1/2 -translate-y-1/2 size-6 hover:bg-muted !p-1"
								>
									<X className="size-4 shrink-0 opacity-50" />
								</Button>
							)}
						</div>

						<CommandList className="max-h-48">
							{!isLoading && <CommandEmpty>{emptyMessage}</CommandEmpty>}
							<CommandGroup>
								{isLoading && (
									<div className="p-2">
										<Skeleton className="w-full h-16" />
									</div>
								)}

								{allowMultiSelect && options.length > 0 && !searchValue && (
									<CommandItem
										onSelect={() => {
											if (allSelected) {
												return handleClearFilter();
											}
											handleSelectAll();
										}}
										className="flex items-center gap-2 cursor-pointer select-none"
									>
										<Checkbox
											checked={allSelected}
											className="pointer-events-none"
										/>
										<span className="flex-1">Selecionar todos</span>
									</CommandItem>
								)}

								{options.map((option) => {
									const isSelected = selectedValues.includes(option.value);

									return (
										<CommandItem
											key={option.value}
											value={option.label}
											onSelect={() => {
												if (allowMultiSelect) {
													handleMultiSelection(option.value);
												} else {
													handleSingleSelection(option.value);
												}
											}}
											className="flex items-center gap-2 cursor-pointer select-none"
										>
											{allowMultiSelect ? (
												<Checkbox
													checked={isSelected}
													className="pointer-events-none"
												/>
											) : (
												<Check
													className={cn(
														"h-4 w-4",
														isSelected ? "opacity-100" : "opacity-0",
													)}
												/>
											)}
											<span className="flex-1">{option.label}</span>
										</CommandItem>
									);
								})}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}
