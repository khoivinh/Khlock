"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TimeZoneConverter } from "@/components/time-zone-converter"
import { ALL_TIMEZONES } from "@/components/time-input"

export default function Home() {
  const [isCustomMode, setIsCustomMode] = useState(false)
  const [selectedTime, setSelectedTime] = useState<Date | null>(null)

  function handleTimeUpdate(zoneKey: string, hours: number, minutes: number) {
    const now = new Date()
    const offset = ALL_TIMEZONES[zoneKey as keyof typeof ALL_TIMEZONES].offset
    const inputTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0)
    const utcTime = new Date(inputTime.getTime() - offset * 3600000)

    setSelectedTime(utcTime)
    setIsCustomMode(true)
  }

  function handleReset() {
    setIsCustomMode(false)
    setSelectedTime(null)
  }

  return (
    <main className="min-h-screen bg-background px-6 py-16 md:px-12 lg:px-24">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex flex-col gap-6 border-b border-border pb-4 md:flex-row md:items-end md:justify-between">
          <h1 className="font-display font-black tracking-tight text-foreground text-5xl">World Khlock</h1>

          {isCustomMode && (
            <Button onClick={handleReset}>
              Show Live Time
            </Button>
          )}
        </header>

        <TimeZoneConverter 
          isCustomMode={isCustomMode} 
          selectedTime={selectedTime} 
          onTimeUpdate={handleTimeUpdate}
        />
      </div>
    </main>
  )
}
