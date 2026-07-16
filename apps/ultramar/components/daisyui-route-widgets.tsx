import { Code2, DatabaseZap, LineChart, Plus, RadioTower, X } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";

const cssVars = (vars: Record<string, string | number>) => vars as CSSProperties;

const quickActionLinks = [
  { label: "Assets", href: "/private-equities/assets", icon: DatabaseZap },
  { label: "Signals", href: "/arbitrage-hedge-fund/signals", icon: LineChart },
  { label: "Status", href: "/system-status", icon: RadioTower },
] as const;

const focusVisibleClass =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export function PlatformQuickActions({ pathname }: { pathname: string }) {
  return (
    <>
      <nav className="dock dock-sm border-t border-border-muted bg-surface xl:hidden" aria-label="Quick product navigation">
        {quickActionLinks.map((item) => {
          const Icon = item.icon;
          const active = isActiveAction(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`${active ? "dock-active text-primary" : "text-on-surface-variant"} ${focusVisibleClass}`}
            >
              <Icon className="size-[1.2em]" aria-hidden="true" />
              <span className="dock-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="fab hidden xl:flex">
        <button type="button" className={`btn btn-square btn-sm border border-border-muted bg-surface text-primary ${focusVisibleClass}`} aria-label="Open quick actions">
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
        <div className="fab-close">
          <span className="sr-only">Close quick actions</span>
          <button type="button" className={`btn btn-square btn-sm btn-neutral ${focusVisibleClass}`} aria-label="Close quick actions">
            <X className="h-4 w-4" />
          </button>
        </div>
        <Link href="/private-equities/assets" className={`btn btn-sm btn-accent gap-2 font-mono text-[10px] uppercase tracking-[0.1em] ${focusVisibleClass}`}>
          <DatabaseZap className="h-4 w-4" aria-hidden="true" />
          Assets
        </Link>
        <Link href="/arbitrage-hedge-fund/signals" className={`btn btn-sm btn-info gap-2 font-mono text-[10px] uppercase tracking-[0.1em] ${focusVisibleClass}`}>
          <LineChart className="h-4 w-4" aria-hidden="true" />
          Signals
        </Link>
        <Link href="/api" className={`btn btn-sm btn-outline gap-2 font-mono text-[10px] uppercase tracking-[0.1em] ${focusVisibleClass}`}>
          <Code2 className="h-4 w-4" aria-hidden="true" />
          API
        </Link>
      </div>
    </>
  );
}
export function CapitalIntakeForm() {
  return (
    <section className="card card-border grid gap-px overflow-hidden bg-border-muted lg:grid-cols-[0.8fr_1.2fr]">
      <div className="min-w-0 bg-surface p-6 sm:p-7 lg:p-8">
        <div className="steps steps-vertical">
          <div className="step step-primary">Eligibility</div>
          <div className="step step-primary">Documents</div>
          <div className="step">Counsel review</div>
        </div>
        <div className="divider">Readiness</div>
        <div className="countdown font-mono text-4xl">
          <span style={cssVars({ "--value": 21 })} aria-label="21 days">
            21
          </span>
        </div>
        <p className="mt-2 text-sm text-on-surface-variant">Target review window in days.</p>
        <div className="pika-single mt-6 max-w-full overflow-x-auto border border-border-muted bg-surface-container-lowest p-3">
          <div className="pika-lendar">
            <div className="pika-title">
              <button type="button" className="pika-prev" aria-label="Previous month" />
              <span className="pika-label">May 2026</span>
              <button type="button" className="pika-next" aria-label="Next month" />
            </div>
            <table className="pika-table">
              <thead>
                <tr>
                  <th>Mo</th>
                  <th>Tu</th>
                  <th>We</th>
                  <th>Th</th>
                  <th>Fr</th>
                  <th>Sa</th>
                  <th>Su</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {[25, 26, 27, 28, 29, 30, 31].map((day) => (
                    <td key={day} className={day === 28 ? "is-selected" : day === 27 ? "is-today" : undefined}>
                      <button type="button" className="pika-button">
                        {day}
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="drawer drawer-end mt-6 h-36 border border-border-muted bg-surface-container-lowest">
          <input id="capital-intake-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content grid place-items-center">
            <label htmlFor="capital-intake-drawer" className="drawer-button btn btn-sm btn-outline">
              Open review drawer
            </label>
          </div>
          <div className="drawer-side">
            <label htmlFor="capital-intake-drawer" aria-label="close sidebar" className="drawer-overlay" />
            <div className="min-h-full w-64 bg-surface p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-status-signal">
                Review queue
              </p>
              <ul className="menu mt-3">
                <li>
                  <Link href="/private-equities/legal">Eligibility</Link>
                </li>
                <li>
                  <Link href="/private-equities/deals">Documents</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <form className="grid min-w-0 gap-5 bg-surface p-6 sm:p-7 lg:p-8">
        <fieldset className="fieldset border border-border-muted bg-surface-container-lowest p-5 sm:p-6">
          <legend className="fieldset-legend font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-on-surface">Investor interest</legend>
          <label className="grid gap-2">
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-on-surface-variant">Email</span>
            <input
              type="email"
              required
              className="input input-success validator h-12 w-full"
              placeholder="investor@example.com"
              defaultValue="investor@example.com"
            />
          </label>
          <p className="validator-hint">Use a valid institutional email.</p>
          <label className="grid gap-2">
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-on-surface-variant">Workflow</span>
            <select className="select select-success h-12 w-full" defaultValue="private-equities" aria-label="Workflow">
              <option value="private-equities">Private Equities</option>
              <option value="arbitrage">Arbitrage Hedge Fund</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-on-surface-variant">Memo</span>
            <textarea
              className="textarea textarea-success min-h-28 w-full"
              defaultValue="Review eligibility, jurisdiction, document status, and allocation intent."
            />
          </label>
          <input type="file" className="file-input file-input-success h-12 w-full" aria-label="Upload diligence file" />
        </fieldset>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="label min-h-12 cursor-pointer justify-start gap-3 border border-border-muted bg-surface-container-lowest px-4">
            <input type="checkbox" className="checkbox checkbox-success" defaultChecked />
            <span>Eligible investor</span>
          </label>
          <label className="label min-h-12 cursor-pointer justify-start gap-3 border border-border-muted bg-surface-container-lowest px-4">
            <input type="checkbox" className="toggle toggle-success" defaultChecked />
            <span>Document alerts</span>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:items-center">
          <div className="flex min-h-12 flex-wrap gap-3 border border-border-muted bg-surface-container-lowest px-3">
            <label className="label cursor-pointer justify-start gap-2">
              <input type="radio" name="allocation-priority" className="radio radio-primary" defaultChecked />
              <span>Primary</span>
            </label>
            <label className="label cursor-pointer justify-start gap-2">
              <input type="radio" name="allocation-priority" className="radio radio-primary" />
              <span>Secondary</span>
            </label>
          </div>
          <div className="rating justify-self-start sm:justify-self-end" aria-label="Readiness rating">
            <input aria-label="Readiness one" type="radio" name="readiness-rating" className="mask mask-star-2 bg-status-signal" />
            <input
              aria-label="Readiness two"
              type="radio"
              name="readiness-rating"
              className="mask mask-star-2 bg-status-signal"
              defaultChecked
            />
            <input aria-label="Readiness three" type="radio" name="readiness-rating" className="mask mask-star-2 bg-status-signal" />
          </div>
        </div>

        <label className="grid gap-3 border border-border-muted bg-surface-container-lowest p-4">
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-on-surface-variant">Allocation confidence</span>
          <input type="range" min={0} max={100} defaultValue={72} className="range range-success" />
        </label>

        <div className="filter max-w-full overflow-x-auto">
          <input className="btn filter-reset" type="radio" name="interest-filter" aria-label="All" />
          <input className="btn" type="radio" name="interest-filter" aria-label="Issuer" />
          <input className="btn" type="radio" name="interest-filter" aria-label="Allocator" />
        </div>
      </form>
    </section>
  );
}
function isActiveAction(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function ComplianceModal() {
  return (
    <div className="card card-border bg-surface p-5">
      <input type="checkbox" id="compliance-scope-modal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box border border-border-muted bg-surface">
          <h3 className="font-serif text-lg font-bold">Access boundary</h3>
          <p className="py-4 text-sm text-on-surface-variant">
            Public materials explain the process. Regulated allocation, issuer onboarding, and transfer steps stay behind
            eligibility, counsel, and document controls.
          </p>
          <div className="modal-action">
            <label htmlFor="compliance-scope-modal" className="btn btn-sm">
              Close
            </label>
          </div>
        </div>
      </div>
      <label htmlFor="compliance-scope-modal" className="btn btn-outline btn-success w-fit">
        Open boundary modal
      </label>
    </div>
  );
}
