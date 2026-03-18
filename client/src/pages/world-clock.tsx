import { useState, useEffect, useRef } from "react";
import { TimeZoneConverter } from "@/components/time-zone-converter";
import { getCityByKey } from "@/lib/city-lookup";

// Header animation constants
const SCROLL_RANGE = 120; // px of scroll over which the shrink fully plays out
const PY_START = 32;      // py-8 = 2rem = 32px
const PY_END = 12;        // py-3 = 0.75rem = 12px
const FS_START = 48;      // text-5xl = 3rem = 48px
const FS_END = 30;        // text-3xl = 1.875rem = 30px

export default function WorldClock() {
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);

  // Scroll-driven header shrink: interpolate styles directly from scrollY
  // so the header tracks the finger perfectly with no CSS transition snap.
  useEffect(() => {
    function updateHeader() {
      const ratio = Math.min(1, Math.max(0, window.scrollY / SCROLL_RANGE));
      if (headerRef.current) {
        const py = PY_START + (PY_END - PY_START) * ratio;
        headerRef.current.style.paddingTop = `${py}px`;
        headerRef.current.style.paddingBottom = `${py}px`;
      }
      if (h1Ref.current) {
        const fs = FS_START + (FS_END - FS_START) * ratio;
        h1Ref.current.style.fontSize = `${fs}px`;
        h1Ref.current.style.lineHeight = `${fs}px`;
      }
    }

    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  function handleTimeUpdate(zoneKey: string, hours: number, minutes: number) {
    const city = getCityByKey(zoneKey);
    if (!city) return;

    const now = new Date();
    const inputTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
    const utcTime = new Date(inputTime.getTime() - (city.offset * 3600000) - (inputTime.getTimezoneOffset() * 60000));

    setSelectedTime(utcTime);
    setIsCustomMode(true);
  }

  function handleReset() {
    setIsCustomMode(false);
    setSelectedTime(null);
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Sticky header */}
      <header
        ref={headerRef}
        className="sticky top-0 z-50 bg-background border-b border-border px-6 md:px-12 lg:px-24 py-8"
      >
        <div className="mx-auto max-w-4xl flex flex-row items-center justify-between gap-4">
          <h1
            ref={h1Ref}
            className="font-display font-black tracking-tight text-foreground text-5xl"
            data-testid="text-app-title"
          >
            Khlock
          </h1>
        </div>
      </header>

      <div className="px-6 py-8 md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <TimeZoneConverter
            isCustomMode={isCustomMode}
            selectedTime={selectedTime}
            onTimeUpdate={handleTimeUpdate}
            onReset={handleReset}
          />
        </div>
      </div>
    </main>
  );
}
