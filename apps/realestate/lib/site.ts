export const siteName = "Ultramar Real Estate";
export const siteDomain = "https://realestate.ultramar.capital";
export const siteDescription =
  "Ultramar Real Estate: propiedades seleccionadas y fichas comerciales aprobadas para difusión.";

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteDomain}${normalizedPath}`;
}
