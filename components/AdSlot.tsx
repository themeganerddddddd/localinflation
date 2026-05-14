"use client";

import { useEffect } from "react";

type AdSlotProps = {
  slotName: string;
  className?: string;
};

export default function AdSlot({ slotName, className = "" }: AdSlotProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const fallbackSlotId = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID;
  const adSlot = fallbackSlotId || slotName;

  useEffect(() => {
    if (!clientId) return;
    try {
      ((window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle = (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || []).push({});
    } catch {
      // AdSense may reject duplicate pushes during local development or route transitions.
    }
  }, [clientId, adSlot]);

  if (!clientId) {
    return (
      <div className={`flex min-h-24 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-400 ${className}`}>
        Advertisement
      </div>
    );
  }
  return (
    <ins
      className={`adsbygoogle block ${className}`}
      data-ad-client={clientId}
      data-ad-slot={adSlot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
