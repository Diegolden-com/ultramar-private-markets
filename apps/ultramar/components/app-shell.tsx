"use client";

import { BrandName, BrandText } from "@/components/brand-name";
import { footerLinks } from "@/lib/footer-routes";
import { headerNavItems, headerUtilityLinks } from "@/lib/site-navigation";
import { ChevronDown, LogIn, Menu, Monitor, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type HeaderNavItem = (typeof headerNavItems)[number];
type HeaderNavLink = HeaderNavItem["links"][number];

const terminalLink = headerUtilityLinks[0];
const signInLink = headerUtilityLinks[1];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const terminalActive = isActiveHref(pathname, terminalLink.href);
  const authActive = pathname.startsWith("/auth");
  const closeMenus = () => {
    setOpen(false);
    setActiveMenu(null);
  };

  useEffect(() => {
    if (!activeMenu) return;

    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && headerRef.current?.contains(event.target)) return;
      setActiveMenu(null);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setActiveMenu(null);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeMenu]);

  return (
    <div className="min-h-screen bg-surface-ink text-on-surface">
      <header
        ref={headerRef}
        className="sticky top-0 z-50 border-b border-border-muted bg-surface"
        onBlur={(event) => {
          const nextFocusedElement = event.relatedTarget;

          if (!(nextFocusedElement instanceof Node) || !event.currentTarget.contains(nextFocusedElement)) {
            setActiveMenu(null);
          }
        }}
      >
        <div className="mx-auto flex min-h-12 w-full max-w-[1600px] items-center justify-between px-4 py-0 md:px-12">
          <div className="flex min-w-0 items-center gap-6 md:gap-8">
            <Link
              href="/"
              className="flex h-12 shrink-0 items-center truncate font-serif text-xl font-bold leading-none text-on-surface"
              onClick={closeMenus}
            >
              <BrandName />
            </Link>
            <nav className="hidden h-12 items-stretch gap-1 lg:flex" aria-label="Primary navigation">
              {headerNavItems.map((item) =>
                item.links.length > 0 ? (
                  <DesktopNavMenu
                    key={item.key}
                    item={item}
                    pathname={pathname}
                    open={activeMenu === item.key}
                    onToggle={() => setActiveMenu((value) => (value === item.key ? null : item.key))}
                    onNavigate={closeMenus}
                  />
                ) : (
                  <TerminalNavLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    active={isActiveHeaderItem(pathname, item)}
                    onClick={closeMenus}
                  />
                ),
              )}
            </nav>
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            <Link
              href={terminalLink.href}
              aria-current={terminalActive ? "page" : undefined}
              onClick={closeMenus}
              className={`btn btn-sm gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] ${
                terminalActive ? "btn-info" : "btn-outline btn-info"
              }`}
            >
              <Monitor className="h-4 w-4" aria-hidden="true" />
              {terminalLink.label}
            </Link>
            <Link
              href={signInLink.href}
              aria-current={authActive ? "page" : undefined}
              onClick={closeMenus}
              className={`btn btn-sm gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] ${
                authActive
                  ? "btn-info"
                  : "btn-ghost text-on-surface-variant hover:text-primary"
              }`}
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              {signInLink.label}
            </Link>
          </div>

          <button
            className="btn btn-square btn-ghost btn-sm border border-border-muted bg-surface-ink text-on-surface lg:hidden"
            onClick={() => {
              setOpen((value) => !value);
              setActiveMenu(null);
            }}
            aria-label="Toggle navigation"
            type="button"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open ? (
          <nav className="border-t border-border-muted bg-surface lg:hidden" aria-label="Mobile navigation">
            <ul className="menu grid p-0">
              {headerNavItems.map((item) => (
                <li key={item.key} className="border-b border-border-muted">
                  <Link
                    href={item.href}
                    className={mobileNavClass(isActiveHeaderItem(pathname, item))}
                    aria-current={isActiveHeaderItem(pathname, item) ? "page" : undefined}
                    onClick={closeMenus}
                  >
                    {item.label}
                  </Link>
                  {item.links.length > 0 ? (
                    <div className="grid bg-surface-ink/40">
                      {item.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={mobileSubNavClass(isActiveHref(pathname, link.href))}
                          aria-current={isActiveHref(pathname, link.href) ? "page" : undefined}
                          onClick={closeMenus}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </li>
              ))}
              <li className="border-b border-border-muted">
                <Link
                  href={terminalLink.href}
                  className={mobileNavClass(terminalActive)}
                  aria-current={terminalActive ? "page" : undefined}
                  onClick={closeMenus}
                >
                  {terminalLink.label}
                </Link>
              </li>
              <li>
                <Link
                  href={signInLink.href}
                  className={mobileNavClass(authActive)}
                  aria-current={authActive ? "page" : undefined}
                  onClick={closeMenus}
                >
                  {signInLink.label}
                </Link>
              </li>
            </ul>
          </nav>
        ) : null}
      </header>

      {children}

      <footer className="footer border-t border-border-muted bg-surface-container-lowest px-4 py-8 md:px-12">
        <div className="flex w-full flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <BrandName as="p" className="font-serif text-xl font-bold text-on-surface" />
            <p className="mt-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
              (c)2024 <BrandName /> Group. All rights reserved. Disclosures and controls.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-3">
            {footerLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant underline transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}

function mobileNavClass(active: boolean) {
  return `rounded-none px-4 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] ${
    active
      ? "active !bg-primary !text-primary-foreground"
      : "text-on-surface-variant hover:text-primary"
  }`;
}

function mobileSubNavClass(active: boolean) {
  return `border-t border-border-muted px-8 py-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] ${
    active
      ? "bg-surface-container text-primary"
      : "text-on-surface-variant hover:bg-surface-container hover:text-primary"
  }`;
}

function isActiveHeaderItem(pathname: string, item: HeaderNavItem) {
  return isActiveHref(pathname, item.href);
}

function isActiveHref(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function TerminalNavLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={`flex h-12 items-center border-b-2 px-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] transition-colors ${
        active
          ? "border-primary text-primary"
          : "border-transparent text-on-surface-variant hover:text-primary"
      }`}
    >
      {label}
    </Link>
  );
}

function DesktopNavMenu({
  item,
  pathname,
  open,
  onToggle,
  onNavigate,
}: {
  item: HeaderNavItem;
  pathname: string;
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const active = isActiveHeaderItem(pathname, item);
  const menuId = `${item.key}-menu`;

  return (
    <div className="group relative flex h-12 items-stretch">
      <button
        type="button"
        aria-current={active ? "page" : undefined}
        aria-controls={menuId}
        aria-expanded={open}
        onClick={onToggle}
        className={`flex h-full items-center gap-1 border-b-2 px-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] transition-colors ${
          active || open
            ? "border-primary text-primary"
            : "border-transparent text-on-surface-variant hover:text-primary"
        }`}
      >
        {item.label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      <div
        id={menuId}
        className={`absolute left-0 top-full z-50 max-h-[calc(100vh-3rem)] w-[360px] overflow-y-auto border border-border-muted bg-surface shadow-2xl shadow-black/30 transition-opacity ${
          open ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
        }`}
      >
        <div className="border-b border-border-muted bg-surface-container-low p-4">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-primary">
            {item.label}
          </p>
          <p className="mt-2 text-sm leading-5 text-on-surface-variant">
            <BrandText>{item.description}</BrandText>
          </p>
        </div>
        <div className="grid">
          {item.links.map((link) => (
            <DesktopMenuLink
              key={link.href}
              link={link}
              active={isActiveHref(pathname, link.href)}
              onClick={onNavigate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DesktopMenuLink({
  link,
  active,
  onClick,
}: {
  link: HeaderNavLink;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={link.href}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={`border-b border-border-muted px-4 py-3 transition-colors last:border-b-0 ${
        active ? "bg-surface-container text-primary" : "hover:bg-surface-container"
      }`}
    >
      <span className="block font-mono text-[11px] font-medium uppercase tracking-[0.08em]">
        {link.label}
      </span>
      {link.description ? (
        <span className="mt-1 block text-sm leading-5 text-on-surface-variant">
          <BrandText>{link.description}</BrandText>
        </span>
      ) : null}
    </Link>
  );
}
