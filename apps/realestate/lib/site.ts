export const siteName = "Ultramar Real Estate";
export const siteDomain = "https://realestate.ultramar.capital";
export const siteDescription =
  "Propiedades en venta en Morelos e Hidalgo, con precio publicado, datos claros y contacto directo.";

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteDomain}${normalizedPath}`;
}
