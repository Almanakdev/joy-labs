"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isMuted, toggleMuted, unlockAudio } from "@/lib/sound";

export function SoundToggle({ className }: { className?: string }) {
  const [muted, setMuted] = useState(false);
  useEffect(() => setMuted(isMuted()), []);

  return (
    <button
      onClick={() => {
        unlockAudio();
        setMuted(toggleMuted());
      }}
      title={muted ? "Unmute sounds" : "Mute sounds"}
      aria-label={muted ? "Unmute sounds" : "Mute sounds"}
      className={className ?? "btn-ghost !p-2"}
    >
      {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </button>
  );
}
