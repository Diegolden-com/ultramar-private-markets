export default function DataRoomLoading() {
  return (
    <div className="grid animate-pulse gap-4" aria-label="Loading data room" role="status">
      <div className="h-44 border border-border-muted bg-surface" />
      <div className="grid min-h-[520px] border border-border-muted bg-surface lg:grid-cols-[15rem_minmax(0,1fr)_20rem]">
        <div className="hidden border-r border-border-muted bg-surface-container-lowest lg:block" />
        <div className="p-5"><div className="h-12 bg-surface-container-low" /><div className="mt-5 grid gap-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-14 bg-surface-container-low" />)}</div></div>
        <div className="hidden border-l border-border-muted bg-surface-container-lowest lg:block" />
      </div>
      <span className="sr-only">Loading data room</span>
    </div>
  );
}
