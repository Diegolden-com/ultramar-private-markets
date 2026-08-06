const rawEmail = process.env.NEXT_PUBLIC_REAL_ESTATE_CONTACT_EMAIL?.trim() ?? "";
const rawWhatsapp = process.env.NEXT_PUBLIC_REAL_ESTATE_CONTACT_WHATSAPP?.trim() ?? "";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizeWhatsapp(value: string) {
  if (!/^\+?[\d\s().-]+$/.test(value)) return "";

  const digits = value.replace(/\D/g, "");
  return /^[1-9]\d{7,14}$/.test(digits) ? digits : "";
}

const email = isValidEmail(rawEmail) ? rawEmail : "";
const whatsapp = normalizeWhatsapp(rawWhatsapp);

export type InquiryIntent = "information" | "availability" | "current-media";

export const contact = {
  email,
  whatsapp,
};

export const hasContactChannel = Boolean(contact.email || contact.whatsapp);

export function inquiryHref(listingName?: string, intent: InquiryIntent = "information") {
  const request = {
    information: "recibir información",
    availability: "recibir la ficha y confirmar disponibilidad",
    "current-media": "recibir fotos y video actuales",
  }[intent];
  const subject = listingName
    ? `Solicitud de información — ${listingName}`
    : "Solicitud de información — Ultramar Real Estate";
  const message = listingName
    ? `Hola, me interesa ${request} sobre ${listingName}.`
    : `Hola, me interesa ${request} sobre las propiedades disponibles de Ultramar Real Estate.`;

  if (contact.whatsapp) {
    return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
  }

  if (contact.email) {
    return `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  }

  return undefined;
}
