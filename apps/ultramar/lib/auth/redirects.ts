import { LCX_DATA_ROOM } from "@/lib/data-room/constants";

export const DEFAULT_AUTH_RETURN_TO = "/arbitrage-hedge-fund/dashboard";

export function safeReturnTo(value: FormDataEntryValue | string | null | undefined) {
  if (typeof value !== "string") return DEFAULT_AUTH_RETURN_TO;

  const path = value.trim();
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) {
    return DEFAULT_AUTH_RETURN_TO;
  }

  try {
    const parsed = new URL(path, "https://ultramar.capital");
    if (parsed.origin !== "https://ultramar.capital") return DEFAULT_AUTH_RETURN_TO;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return DEFAULT_AUTH_RETURN_TO;
  }
}

export function withReturnTo(path: string, returnTo: string) {
  const params = new URLSearchParams({ returnTo: safeReturnTo(returnTo) });
  return `${path}?${params.toString()}`;
}

export function resolveAuthReturnTo(value: FormDataEntryValue | string | null | undefined) {
  let destination = safeReturnTo(value);

  for (let depth = 0; depth < 4; depth += 1) {
    const parsed = new URL(destination, "https://ultramar.capital");
    if (!parsed.pathname.startsWith("/auth/")) break;

    const nestedReturnTo = parsed.searchParams.get("returnTo");
    if (!nestedReturnTo) break;
    destination = safeReturnTo(nestedReturnTo);
  }

  return destination;
}

export function targetsLcxDataRoom(value: FormDataEntryValue | string | null | undefined) {
  const destination = new URL(resolveAuthReturnTo(value), "https://ultramar.capital");
  return (
    destination.pathname === LCX_DATA_ROOM.path ||
    destination.pathname.startsWith(`${LCX_DATA_ROOM.path}/`)
  );
}
