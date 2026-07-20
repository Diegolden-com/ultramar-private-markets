import { DataRoomAccessGate } from "@/components/data-room/access-gate";
import { DataRoomAdminConsole } from "@/components/data-room/admin-console";
import { DataRoomHeader, DataRoomWorkspace, type DataRoomQuery } from "@/components/data-room/workspace";
import { SurfacePanel } from "@/components/page-layout";
import { LCX_DATA_ROOM } from "@/lib/data-room/constants";
import { getLcxDataRoomState } from "@/lib/data-room/server";
import { createSeoMetadata } from "@/lib/seo";
import { DatabaseZap, RefreshCcw, ShieldAlert } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = createSeoMetadata({
  title: "LCX Capital Data Room",
  description: "Controlled diligence workspace for the LCX Capital round.",
  path: LCX_DATA_ROOM.path,
  noIndex: true,
});

export default async function LcxDataRoomPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [state, rawQuery] = await Promise.all([getLcxDataRoomState(), searchParams]);
  const query = normalizeQuery(rawQuery);

  if (state.kind === "unconfigured") return <UnconfiguredState />;
  if (state.kind === "error") return <DataRoomErrorState message={state.message} />;
  if (state.kind === "restricted") return <DataRoomAccessGate state={state} />;

  const activeView = state.viewer.canManage && query.view === "admin" ? "admin" : "documents";

  return (
    <>
      <DataRoomHeader state={state} activeView={activeView} />
      {activeView === "admin" ? (
        <DataRoomAdminConsole state={state} />
      ) : (
        <DataRoomWorkspace state={state} query={query} />
      )}
    </>
  );
}

function UnconfiguredState() {
  return (
    <SurfacePanel className="min-h-[520px] place-items-center">
      <div className="mx-auto flex max-w-xl flex-col items-center py-16 text-center">
        <span className="grid h-12 w-12 place-items-center border border-primary/40 bg-primary/10 text-primary">
          <DatabaseZap className="h-6 w-6" aria-hidden="true" />
        </span>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.12em] text-accent">Backend activation required</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold">The data room is safely offline</h1>
        <p className="mt-5 text-sm leading-6 text-on-surface-variant">
          Supabase public variables are not configured in this environment. No private metadata or fixture access is being served.
        </p>
        <Link href="/private-equities/assets/lcx" className="btn btn-outline btn-primary mt-7">Return to LCX</Link>
      </div>
    </SurfacePanel>
  );
}

function DataRoomErrorState({ message }: { message: string }) {
  return (
    <SurfacePanel className="min-h-[520px] place-items-center">
      <div className="mx-auto flex max-w-xl flex-col items-center py-16 text-center">
        <ShieldAlert className="h-8 w-8 text-destructive" aria-hidden="true" />
        <h1 className="mt-5 font-serif text-4xl font-semibold">Data room unavailable</h1>
        <p className="mt-4 text-sm leading-6 text-on-surface-variant">{message}</p>
        <Link href={LCX_DATA_ROOM.path} className="btn btn-outline btn-primary mt-7">
          <RefreshCcw className="h-4 w-4" aria-hidden="true" /> Retry
        </Link>
      </div>
    </SurfacePanel>
  );
}

function normalizeQuery(values: Record<string, string | string[] | undefined>): DataRoomQuery {
  const first = (key: string) => {
    const value = values[key];
    return Array.isArray(value) ? value[0] : value;
  };

  return {
    q: first("q")?.slice(0, 120),
    folder: first("folder"),
    type: first("type"),
    sort: first("sort"),
    document: first("document"),
    view: first("view"),
  };
}
