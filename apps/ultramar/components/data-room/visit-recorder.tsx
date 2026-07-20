"use client";

import { recordVisitAction } from "@/app/private-equities/assets/lcx/dataroom/actions";
import { useEffect, useRef, useTransition } from "react";

export function DataRoomVisitRecorder() {
  const recorded = useRef(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (recorded.current) return;
    recorded.current = true;
    startTransition(async () => {
      await recordVisitAction();
    });
  }, []);

  return null;
}
