"use client";

import { useAdmin } from "@/lib/admin-store";

export function AnnouncementBar() {
  const { settings } = useAdmin();

  const text = settings.announcementText || "";

  const displayText = settings.showGoldRateInBar
    ? text.replace(/₹[\d,]+\/g/g, `₹${settings.goldRatePerGram.toLocaleString("en-IN")}/g`)
    : text.replace(/·?\s*Today'?s gold rate ₹[\d,]+\/g\s*·?/gi, "").replace(/·\s*·/g, "·").trim().replace(/^·|·$/g, "").trim();

  if (!displayText) return null;

  return (
    <div className="bg-brand text-gold-light text-center text-xs tracking-wide py-2 px-4">
      {displayText}
    </div>
  );
}
