"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

export type Matcher = {
	path: string;

	/** se true, faz match por prefixo (ex: '/dashboard' ativa em '/dashboard/relatorio') */
	partial?: boolean;

	/** se true, ignora case sensitivity */
	insensitive?: boolean;
};

/**
 * Retorna o path atual e utilitários para saber qual item da sidebar está ativo.
 */
export function useActivePath(matchers: Matcher[] = []) {
	const pathname = usePathname() || "/";

	const normalizedPathname = useMemo(() => {
		// remover trailing slash exceto root
		if (pathname !== "/" && pathname.endsWith("/")) {
			return pathname.slice(0, -1);
		}
		return pathname;
	}, [pathname]);

	const active = useMemo(() => {
		for (const matcher of matchers) {
			const target = matcher.insensitive
				? matcher.path.toLowerCase()
				: matcher.path;
			const current = matcher.insensitive
				? normalizedPathname.toLowerCase()
				: normalizedPathname;

			if (matcher.partial) {
				if (current.startsWith(target)) {
					return matcher.path;
				}
			} else {
				if (current === target) {
					return matcher.path;
				}
			}
		}
		return null;
	}, [matchers, normalizedPathname]);

	const isActive = (
		path: string,
		options?: { partial?: boolean; insensitive?: boolean },
	) => {
		const partial = options?.partial ?? false;
		const insensitive = options?.insensitive ?? false;

		const target = insensitive ? path.toLowerCase() : path;
		const current = insensitive
			? normalizedPathname.toLowerCase()
			: normalizedPathname;

		if (partial) {
			return current.startsWith(target);
		}
		return current === target;
	};

	return {
		path: normalizedPathname,
		active, // o matcher.path que casou primeiro (ou null)
		isActive, // função utilitária para checar qualquer path
	};
}
