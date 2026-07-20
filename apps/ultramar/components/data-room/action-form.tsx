"use client";

import {
  initialDataRoomActionState,
  type DataRoomActionState,
} from "@/app/private-equities/assets/lcx/dataroom/action-state";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";

type DataRoomServerAction = (
  state: DataRoomActionState,
  formData: FormData,
) => Promise<DataRoomActionState>;

export function DataRoomActionForm({
  action,
  children,
  submitLabel,
  pendingLabel,
  className = "grid gap-4",
  buttonClassName = "btn btn-primary",
}: {
  action: DataRoomServerAction;
  children: React.ReactNode;
  submitLabel: string;
  pendingLabel?: string;
  className?: string;
  buttonClassName?: string;
}) {
  const [state, formAction] = useActionState(action, initialDataRoomActionState);
  const router = useRouter();

  useEffect(() => {
    if (state.status === "success") router.refresh();
  }, [router, state]);

  return (
    <form action={formAction} className={className}>
      {children}
      {state.status !== "idle" ? (
        <div
          className={`alert rounded-none py-2 text-xs ${state.status === "error" ? "alert-error" : "alert-success"}`}
          role={state.status === "error" ? "alert" : "status"}
        >
          <span>{state.message}</span>
        </div>
      ) : null}
      <ActionSubmitButton
        submitLabel={submitLabel}
        pendingLabel={pendingLabel ?? `${submitLabel}…`}
        className={buttonClassName}
      />
    </form>
  );
}

function ActionSubmitButton({
  submitLabel,
  pendingLabel,
  className,
}: {
  submitLabel: string;
  pendingLabel: string;
  className: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? pendingLabel : submitLabel}
    </button>
  );
}
