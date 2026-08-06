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

export const contact = {
  email,
  whatsapp,
};

export const hasContactChannel = Boolean(contact.email || contact.whatsapp);

export function inquiryHref(listingName?: string) {
  const subject = listingName
    ? `Solicitud de información — ${listingName}`
    : "Solicitud de información — Ultramar Real Estate";
  const message = listingName
    ? `Hola, me interesa recibir información sobre ${listingName}.`
    : "Hola, me interesa recibir información sobre las propiedades de Ultramar Real Estate.";

  if (contact.whatsapp) {
    return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
  }

  if (contact.email) {
    return `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  }

  return undefined;
}
