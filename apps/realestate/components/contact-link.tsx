import { hasContactChannel, inquiryHref, type InquiryIntent } from "@/lib/contact";
import type { ReactNode } from "react";

export function ContactLink({
  children,
  listingName,
  className,
  intent,
}: {
  children: ReactNode;
  listingName?: string;
  className?: string;
  intent?: InquiryIntent;
}) {
  const href = inquiryHref(listingName, intent);
  if (!href) return null;

  const opensNewWindow = href.startsWith("https://");

  return (
    <a
      href={href}
      className={className}
      target={opensNewWindow ? "_blank" : undefined}
      rel={opensNewWindow ? "noreferrer" : undefined}
      data-contact-ready={hasContactChannel ? "true" : "false"}
    >
      <span>{children}</span>
      {opensNewWindow ? <span className="sr-only"> (abre en una nueva pestaña)</span> : null}
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="M3 13 13 3M5 3h8v8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </a>
  );
}
