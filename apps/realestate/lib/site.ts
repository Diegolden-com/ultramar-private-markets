export const siteName = "Ultramar Real Estate";
export const siteDomain = "https://realestate.ultramar.capital";
export const siteDescription =
  "Casas y terrenos en venta directa en Morelos e Hidalgo. Consulta fichas comerciales verificadas de Ultramar Real Estate.";

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteDomain}${normalizedPath}`;
}
