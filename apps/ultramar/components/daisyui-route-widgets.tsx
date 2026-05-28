import Link from "next/link";
import type { CSSProperties } from "react";

const cssVars = (vars: Record<string, string | number>) => vars as CSSProperties;

export function PlatformQuickActions() {
  return (
    <>
      <nav className="dock dock-sm border-t border-border-muted bg-surface lg:hidden" aria-label="Quick product navigation">
        <Link href="/private-equities" className="dock-active">
          <span className="dock-label">Assets</span>
        </Link>
        <Link href="/arbitrage-hedge-fund/signals">
          <span className="dock-label">Signals</span>
        </Link>
        <Link href="/system-status">
          <span className="dock-label">Status</span>
        </Link>
      </nav>

      <div className="fab hidden lg:flex">
        <button type="button" className="btn btn-circle btn-primary" tabIndex={0} aria-label="Open quick actions">
          +
        </button>
        <button type="button" className="fab-close btn btn-circle btn-neutral" aria-label="Close quick actions">
          x
        </button>
        <Link href="/private-equities/assets" className="btn btn-success">
          Assets
        </Link>
        <Link href="/arbitrage-hedge-fund/signals" className="btn btn-info">
          Signals
        </Link>
        <Link href="/api" className="btn btn-outline">
          API
        </Link>
      </div>
    </>
  );
}

export function ProductExperiencePanels() {
  return (
    <section className="grid gap-1 border-y border-border-muted bg-border-muted lg:grid-cols-3">
      <article className="card card-border bg-surface p-5">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
          Live route narrative
        </p>
        <h2 className="mt-3 font-serif text-2xl font-semibold leading-tight">
          Capital workflows stay{" "}
          <span className="text-rotate text-status-signal duration-[7s]">
            <span>
              <span>observable</span>
              <span>gated</span>
              <span>routable</span>
            </span>
          </span>
        </h2>
        <div className="mt-5 carousel w-full border border-border-muted">
          <div className="carousel-item grid h-36 w-full place-items-center bg-surface-container text-sm">
            Private-market assets
          </div>
          <div className="carousel-item grid h-36 w-full place-items-center bg-surface-ink text-sm">
            Polymarket signals
          </div>
        </div>
      </article>

      <article className="card card-border bg-surface p-5">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
          Before / after evidence
        </p>
        <figure className="diff mt-4 aspect-video w-full border border-border-muted" tabIndex={0}>
          <div className="diff-item-1" role="img" tabIndex={0} aria-label="Sparse market data">
            <div className="grid h-full place-content-center bg-surface-container text-4xl font-black">42</div>
          </div>
          <div className="diff-item-2" role="img" aria-label="Governed market data">
            <div className="grid h-full place-content-center bg-primary text-4xl font-black text-primary-foreground">
              91
            </div>
          </div>
          <div className="diff-resizer" />
        </figure>
      </article>

      <article className="card card-border bg-surface p-5">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
          Interface density
        </p>
        <div className="hover-3d mt-4">
          <div className="card w-full bg-surface-container shadow-xl">
            <div className="card-body">
              <div className="stack">
                <div className="mask mask-hexagon grid size-20 place-items-center bg-primary text-primary-foreground">
                  PE
                </div>
                <div className="grid size-20 place-items-center bg-status-signal text-surface-ink">API</div>
                <div className="grid size-20 place-items-center bg-accent text-accent-foreground">ARB</div>
              </div>
            </div>
          </div>
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
        <div className="hover-gallery mt-5 h-24 border border-border-muted">
          <div className="grid place-items-center bg-primary text-primary-foreground">Assets</div>
          <div className="grid place-items-center bg-status-signal text-surface-ink">Oracle</div>
          <div className="grid place-items-center bg-accent text-accent-foreground">Risk</div>
        </div>
        <ul className="timeline timeline-horizontal mt-5">
          <li>
            <div className="timeline-start text-[10px] uppercase tracking-[0.08em]">Asset</div>
            <div className="timeline-middle">
              <span className="status status-success" />
            </div>
            <hr />
          </li>
          <li>
            <hr />
            <div className="timeline-middle">
              <span className="status status-info" />
            </div>
            <div className="timeline-end text-[10px] uppercase tracking-[0.08em]">Signal</div>
          </li>
        </ul>
      </article>
    </section>
  );
}

export function CapitalIntakeForm() {
  return (
    <section className="grid gap-1 bg-border-muted lg:grid-cols-[0.8fr_1.2fr]">
      <div className="bg-surface p-6 md:p-8">
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
        <div className="pika-single mt-6">
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
        <div className="drawer drawer-end mt-6 h-32 border border-border-muted bg-surface-container">
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
                  <a>Eligibility</a>
                </li>
                <li>
                  <a>Documents</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <form className="grid gap-4 bg-surface p-6 md:p-8">
        <fieldset className="fieldset border border-border-muted bg-surface-container p-4">
          <legend className="fieldset-legend">Investor interest</legend>
          <label className="label">
            <span>Email</span>
            <input
              type="email"
              required
              className="input validator w-full"
              placeholder="investor@example.com"
              defaultValue="investor@example.com"
            />
          </label>
          <p className="validator-hint">Use a valid institutional email.</p>
          <label className="label">
            <span>Workflow</span>
            <select className="select w-full" defaultValue="private-equities" aria-label="Workflow">
              <option value="private-equities">Private Equities</option>
              <option value="arbitrage">Arbitrage Hedge Fund</option>
            </select>
          </label>
          <label className="label">
            <span>Memo</span>
            <textarea
              className="textarea w-full"
              defaultValue="Review eligibility, jurisdiction, document status, and allocation intent."
            />
          </label>
          <input type="file" className="file-input w-full" aria-label="Upload diligence file" />
        </fieldset>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="label cursor-pointer justify-start gap-3">
            <input type="checkbox" className="checkbox checkbox-success" defaultChecked />
            <span>Eligible investor</span>
          </label>
          <label className="label cursor-pointer justify-start gap-3">
            <input type="checkbox" className="toggle toggle-success" defaultChecked />
            <span>Document alerts</span>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-wrap gap-3">
            <label className="label cursor-pointer justify-start gap-2">
              <input type="radio" name="allocation-priority" className="radio radio-primary" defaultChecked />
              <span>Primary</span>
            </label>
            <label className="label cursor-pointer justify-start gap-2">
              <input type="radio" name="allocation-priority" className="radio radio-primary" />
              <span>Secondary</span>
            </label>
          </div>
          <div className="rating">
            <input type="radio" name="readiness-rating" className="mask mask-star-2 bg-status-signal" />
            <input
              type="radio"
              name="readiness-rating"
              className="mask mask-star-2 bg-status-signal"
              defaultChecked
            />
            <input type="radio" name="readiness-rating" className="mask mask-star-2 bg-status-signal" />
          </div>
        </div>

        <label className="label grid gap-2">
          <span>Allocation confidence</span>
          <input type="range" min={0} max={100} defaultValue={72} className="range range-success" />
        </label>

        <div className="filter">
          <input className="btn filter-reset" type="radio" name="interest-filter" aria-label="All" />
          <input className="btn" type="radio" name="interest-filter" aria-label="Issuer" />
          <input className="btn" type="radio" name="interest-filter" aria-label="Allocator" />
        </div>
      </form>
    </section>
  );
}

export function ApiMockupPanel() {
  return (
    <section className="grid gap-1 bg-border-muted lg:grid-cols-2">
      <div className="mockup-browser border border-border-muted bg-surface">
        <div className="mockup-browser-toolbar">
          <div className="input">https://ultramar.capital/api</div>
        </div>
        <div className="grid place-content-center border-t border-border-muted p-6">
          <kbd className="kbd">GET</kbd>
          <p className="mt-3 text-sm text-on-surface-variant">Read-only product telemetry.</p>
        </div>
      </div>
      <div className="mockup-window border border-border-muted bg-surface">
        <div className="grid gap-1 border-t border-border-muted p-4">
          <div className="mockup-code">
            <pre data-prefix="$">
              <code>curl /api/arbitrage/signals</code>
            </pre>
            <pre data-prefix=">">
              <code>{"{ status: \"monitored\" }"}</code>
            </pre>
          </div>
        </div>
      </div>
      <div className="mockup-phone mx-auto max-w-56 lg:col-span-2">
        <div className="mockup-phone-camera" />
        <div className="mockup-phone-display grid place-content-center bg-surface-container text-center text-sm">
          Mobile status feed
        </div>
      </div>
    </section>
  );
}

export function OracleConversationPanel() {
  return (
    <section className="grid gap-1 bg-border-muted lg:grid-cols-[1fr_320px]">
      <div className="card card-border bg-surface p-5">
        <div className="chat chat-start">
          <div className="chat-image avatar placeholder">
            <div className="w-10 bg-primary text-primary-foreground">
              <span>IS</span>
            </div>
          </div>
          <div className="chat-header text-on-surface-variant">Issuer system</div>
          <div className="chat-bubble">Operating feed connected.</div>
        </div>
        <div className="chat chat-end">
          <div className="chat-image avatar placeholder">
            <div className="w-10 bg-status-signal text-surface-ink">
              <span>UC</span>
            </div>
          </div>
          <div className="chat-header text-on-surface-variant">Ultramar oracle</div>
          <div className="chat-bubble chat-bubble-primary">Solvency score refreshed.</div>
        </div>
      </div>
      <div className="card card-border bg-surface p-5">
        <div
          className="radial-progress text-status-signal"
          style={cssVars({ "--value": 84, "--size": "5rem", "--thickness": "0.35rem" })}
          role="progressbar"
          aria-valuenow={84}
        >
          84
        </div>
        <div className="mt-5 grid gap-3">
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-1/2" />
        </div>
      </div>
    </section>
  );
}

export function ComplianceModal() {
  return (
    <div className="card card-border bg-surface p-5">
      <input type="checkbox" id="compliance-scope-modal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box border border-border-muted bg-surface">
          <h3 className="font-serif text-lg font-bold">Public surface boundary</h3>
          <p className="py-4 text-sm text-on-surface-variant">
            Public pages explain workflows. Regulated allocation, issuer onboarding, and transfer steps stay behind
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

export function StatusToastPanel() {
  return (
    <div className="toast toast-end !static !translate-x-0">
      <div className="alert alert-success">
        <span className="status status-success" />
        <span>All public routes are operational.</span>
      </div>
    </div>
  );
}

export function PaginationStrip() {
  return (
    <nav className="join" aria-label="Content pagination">
      <button type="button" className="join-item btn">
        1
      </button>
      <button type="button" className="join-item btn btn-active">
        2
      </button>
      <button type="button" className="join-item btn">
        3
      </button>
    </nav>
  );
}
