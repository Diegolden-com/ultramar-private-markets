import { requestAccessAction } from "@/app/private-equities/assets/lcx/dataroom/actions";
import { DataRoomActionForm } from "@/components/data-room/action-form";
import { logoutAction } from "@/app/auth/actions";
import { LCX_DATA_ROOM } from "@/lib/data-room/constants";
import type { RestrictedDataRoomState } from "@/lib/data-room/types";
import { Clock3, KeyRound, LockKeyhole, ShieldX } from "lucide-react";
import Link from "next/link";

const statusCopy = {
  not_requested: {
    title: "Access has not been requested",
    body: "Send a request to the LCX issuer team. Private folder and document metadata stay hidden until approval.",
    icon: LockKeyhole,
  },
  pending: {
    title: "Request pending",
    body: "The issuer team has your request. This page will open the document index as soon as access is approved.",
    icon: Clock3,
  },
  approved: {
    title: "Access approved",
    body: "Refresh this page to open the data room.",
    icon: KeyRound,
  },
  revoked: {
    title: "Access revoked",
    body: "This account no longer has access to the LCX secondary transfer data room. Contact the issuer team if this needs review.",
    icon: ShieldX,
  },
} as const;

export function DataRoomAccessGate({ state }: { state: RestrictedDataRoomState }) {
  const copy = statusCopy[state.requestStatus];
  const Icon = copy.icon;

  return (
    <section className="lcx-dossier-access-gate card card-border overflow-hidden bg-surface">
      <div className="grid min-h-[560px] lg:grid-cols-[0.92fr_1.08fr]">
        <div className="lcx-dossier-access-intro terminal-grid flex min-w-0 flex-col justify-between border-b border-border-muted bg-surface-container-lowest p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
          <div>
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-accent">Private Equities / LCX / Secondary transfer</p>
            <h1 className="mt-5 max-w-[14ch] font-serif text-4xl font-semibold leading-none sm:text-5xl">{LCX_DATA_ROOM.name}</h1>
            <p className="mt-5 max-w-lg text-sm leading-6 text-on-surface-variant">
              Controlled diligence workspace for a possible transfer of existing Lavanderias CX equity. This is not a live offer; document names, versions, and storage locations remain private until access is active.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/private-equities/assets/lcx" className="btn btn-outline btn-primary">Back to asset</Link>
            <form action={logoutAction}><button type="submit" className="btn btn-ghost">Sign out</button></form>
          </div>
        </div>

        <div className="flex min-w-0 items-center p-6 sm:p-8 lg:p-10">
          <div className="lcx-dossier-access-state w-full border border-border-muted bg-surface-dim p-6 sm:p-8">
            <span className="grid h-11 w-11 place-items-center border border-primary/50 bg-primary/10 text-primary">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.12em] text-on-surface-variant">Access state</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold">{copy.title}</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-on-surface-variant">{copy.body}</p>

            {state.requestStatus === "not_requested" ? (
              <DataRoomActionForm
                action={requestAccessAction}
                submitLabel="Request data room access"
                pendingLabel="Sending request…"
                className="mt-7 grid gap-4"
                buttonClassName="btn btn-primary w-full sm:w-fit"
              >
                <label className="grid gap-2" htmlFor="access-note">
                  <span className="font-mono text-[10px] font-medium uppercase tracking-[0.09em] text-on-surface-variant">Optional note</span>
                  <textarea
                    id="access-note"
                    name="requestNote"
                    maxLength={500}
                    className="textarea textarea-primary min-h-24 w-full"
                    placeholder="Share the diligence context the issuer should know."
                  />
                </label>
              </DataRoomActionForm>
            ) : null}

            {state.requestedAt ? (
              <p className="mt-7 border-t border-border-muted pt-4 font-mono text-[10px] uppercase tracking-[0.08em] text-on-surface-variant">
                Requested {formatTimestamp(state.requestedAt)}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}
