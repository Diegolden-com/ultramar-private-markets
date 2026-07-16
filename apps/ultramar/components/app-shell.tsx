"use client";

import { BrandName, BrandText } from "@/components/brand-name";
import { PlatformQuickActions } from "@/components/daisyui-route-widgets";
import { footerLinks } from "@/lib/footer-routes";
import { headerNavItems, headerUtilityLinks, platformRouteGroup, productRouteGroups } from "@/lib/site-navigation";
import { ChevronDown, LogIn, Menu, Monitor, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type HeaderNavItem = (typeof headerNavItems)[number];
type HeaderNavLink = HeaderNavItem["links"][number];

const terminalLink = headerUtilityLinks[0];
const signInLink = headerUtilityLinks[1];
const focusVisibleClass =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
const platformFooterKeys = new Set(["home", "research", "press"]);
const nonNavigableBreadcrumbs = new Set(["/auth"]);
const footerRouteGroups = [
  {
    title: "Platform",
    links: platformRouteGroup.links.filter((link) => platformFooterKeys.has(link.key)),
  },
  {
    title: productRouteGroups["private-equities"].title,
    links: productRouteGroups["private-equities"].links,
  },
  {
    title: productRouteGroups["arbitrage-hedge-fund"].title,
    links: productRouteGroups["arbitrage-hedge-fund"].links,
  },
  {
    title: "Operations",
    links: [
      { label: "API", href: "/api" },
      { label: "System Status", href: "/system-status" },
      ...footerLinks,
    ],
  },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const terminalActive = isActiveHref(pathname, terminalLink.href);
  const authActive = pathname.startsWith("/auth");
  const breadcrumbs = breadcrumbItems(pathname);
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
    <div className="min-h-screen bg-surface-ink pb-16 text-on-surface lg:pb-0">
      <a
        href="#main-content"
        className={`btn btn-sm btn-info fixed left-4 top-4 z-[100] -translate-y-16 font-mono text-[11px] font-medium uppercase tracking-[0.08em] opacity-0 transition-[opacity,transform] ${focusVisibleClass} focus-visible:translate-y-0 focus-visible:opacity-100`}
      >
        Skip to content
      </a>
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
        <div className="navbar mx-auto min-h-16 w-full max-w-[1440px] px-4 py-0 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex min-w-0 flex-1 items-center gap-7 xl:gap-10">
            <Link
              href="/"
              className={`flex h-16 shrink-0 items-center truncate font-serif text-[1.35rem] font-bold leading-none text-on-surface ${focusVisibleClass}`}
              onClick={closeMenus}
            >
              <BrandName />
            </Link>
            <nav className="hidden h-16 items-stretch gap-0 xl:flex" aria-label="Primary navigation">
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

          <div className="hidden flex-none items-center gap-2 xl:flex">
            <Link
              href={terminalLink.href}
              aria-current={terminalActive ? "page" : undefined}
              onClick={closeMenus}
              className={`indicator tooltip tooltip-bottom btn btn-sm h-10 gap-2 px-4 font-mono text-[10px] font-medium uppercase tracking-[0.1em] ${focusVisibleClass} ${
                terminalActive ? "btn-info" : "btn-outline btn-info"
              }`}
              data-tip={terminalLink.description}
            >
              <span className="indicator-item status status-success" />
              <Monitor className="h-4 w-4" aria-hidden="true" />
              {terminalLink.label}
            </Link>
            <Link
              href={signInLink.href}
              aria-current={authActive ? "page" : undefined}
              onClick={closeMenus}
              className={`btn btn-sm h-10 gap-2 px-3 font-mono text-[10px] font-medium uppercase tracking-[0.1em] ${focusVisibleClass} ${
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
            className={`btn btn-square btn-ghost h-11 w-11 border border-border-muted bg-surface-ink text-on-surface xl:hidden ${focusVisibleClass}`}
            onClick={() => {
              setOpen((value) => !value);
              setActiveMenu(null);
            }}
            aria-label="Toggle navigation"
            aria-controls="mobile-navigation"
            aria-expanded={open}
            type="button"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open ? (
          <nav
            id="mobile-navigation"
            className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-border-muted bg-surface xl:hidden"
            aria-label="Mobile navigation"
          >
            <ul className="menu mx-auto w-full max-w-[1440px] p-0">
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
                    <ul className="rounded-none bg-surface-container-lowest p-0">
                      {item.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className={mobileSubNavClass(isActiveHref(pathname, link.href))}
                            aria-current={isActiveHref(pathname, link.href) ? "page" : undefined}
                            onClick={closeMenus}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
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

      {breadcrumbs.length > 1 ? (
        <nav
          className="breadcrumbs overflow-x-auto border-b border-border-muted bg-surface-container-lowest px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-on-surface-variant sm:px-6 lg:px-8 xl:px-12"
          aria-label="Breadcrumb"
        >
          <ul className="mx-auto max-w-[1440px]">
            {breadcrumbs.map((item, index) => (
              <li key={item.href}>
                {index === breadcrumbs.length - 1 || nonNavigableBreadcrumbs.has(item.href) ? (
                  <span className={index === breadcrumbs.length - 1 ? "text-on-surface" : undefined}>
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} onClick={closeMenus} className={focusVisibleClass}>
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      {children}

      <footer className="border-t border-border-muted bg-surface-container-lowest text-on-surface">
        <div className="footer mx-auto w-full max-w-[1440px] gap-10 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:footer-horizontal lg:gap-8 lg:px-8 lg:py-12 xl:px-12">
          <aside className="max-w-md sm:col-span-2 lg:col-span-1">
            <BrandName as="p" className="font-serif text-2xl font-bold text-on-surface" />
            <div className="mt-5 h-px w-12 bg-accent" aria-hidden="true" />
            <p className="mt-5 max-w-sm font-mono text-[10px] font-medium uppercase leading-5 tracking-[0.1em] text-on-surface-variant">
              (c){new Date().getFullYear()} <BrandName /> Group. All rights reserved. Disclosures and controls.
            </p>
          </aside>
          {footerRouteGroups.map((group) => (
            <nav key={group.title} className="min-w-0">
              <h2 className="footer-title mb-1 font-mono text-[10px] tracking-[0.12em] text-on-surface">
                {group.title}
              </h2>
              {group.links.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`link-hover font-mono text-[10px] font-medium uppercase leading-5 tracking-[0.1em] text-on-surface-variant transition-colors hover:text-primary ${focusVisibleClass}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>
      </footer>
      <PlatformQuickActions pathname={pathname} />
    </div>
  );
}

function mobileNavClass(active: boolean) {
  return `min-h-12 rounded-none px-4 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.1em] sm:px-6 ${focusVisibleClass} ${
    active
      ? "menu-active !bg-surface-container !text-primary"
      : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
  }`;
}

function mobileSubNavClass(active: boolean) {
  return `min-h-11 border-t border-border-muted px-8 py-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.1em] sm:px-10 ${focusVisibleClass} ${
    active
      ? "menu-active !bg-surface-container !text-primary"
      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
  }`;
}

function isActiveHeaderItem(pathname: string, item: HeaderNavItem) {
  return isActiveHref(pathname, item.href);
}

function isActiveHref(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function breadcrumbItems(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  return [
    { label: "Home", href: "/" },
    ...segments.map((segment, index) => ({
      label: segment
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
      href: `/${segments.slice(0, index + 1).join("/")}`,
    })),
  ];
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
      className={`flex h-16 items-center border-b-2 px-3 font-mono text-[10px] font-medium uppercase tracking-[0.1em] transition-colors ${focusVisibleClass} ${
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
    <div className={`dropdown group relative flex h-16 items-stretch ${open ? "dropdown-open" : ""}`}>
      <button
        type="button"
        aria-current={active ? "page" : undefined}
        aria-controls={menuId}
        aria-expanded={open}
        onClick={onToggle}
        className={`flex h-full items-center gap-1.5 border-b-2 px-3 font-mono text-[10px] font-medium uppercase tracking-[0.1em] transition-colors ${focusVisibleClass} ${
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
        className={`dropdown-content card card-border absolute left-0 top-full z-50 max-h-[calc(100vh-4rem)] w-[360px] overflow-y-auto bg-surface p-0 shadow-md shadow-black/20 transition-opacity ${
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
        <ul className="menu grid p-0">
          {item.links.map((link) => (
            <li key={link.href}>
              <DesktopMenuLink
                link={link}
                active={isActiveHref(pathname, link.href)}
                onClick={onNavigate}
              />
            </li>
          ))}
        </ul>
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
      className={`border-b border-border-muted px-4 py-3 transition-colors last:border-b-0 ${focusVisibleClass} ${
        active ? "menu-active !bg-surface-container !text-primary" : "hover:bg-surface-container"
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
