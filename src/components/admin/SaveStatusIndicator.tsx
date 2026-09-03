"use client";

import { useAdmin } from "@/lib/admin-store";

export function SaveStatusIndicator() {
  const { saveStatus } = useAdmin();

  if (saveStatus === "idle") return null;

  const config = {
    saving: { text: "Saving…", className: "bg-beige text-ink/60" },
    saved: { text: "✓ All changes saved", className: "bg-[#e8f5ee] text-[#1F7A45]" },
    error: { text: "⚠ Couldn't save — check your connection", className: "bg-red-50 text-red-600" },
  }[saveStatus];

  return (
    <div className="sticky top-0 z-30 flex justify-end mb-4 -mt-2 -mr-2">
      <span className={"rounded-full px-3 py-1.5 text-xs font-medium shadow-sm transition-colors " + config.className}>
        {config.text}
      </span>
    </div>
  );
}
