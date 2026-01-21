"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Plus, LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DigitalClock } from "@/components/digital-clock"
import { ALL_TIMEZONES, detectLocalTimezone } from "@/components/time-input"

interface TimeZoneConverterProps {
  isCustomMode: boolean
  selectedTime: Date | null
  onTimeUpdate: (zoneKey: string, hours: number, minutes: number) => void
}

const AVAILABLE_ZONES = [
  "paris",
  "newYork",
  "losAngeles",
  "tokyo",
  "sydney",
  "dubai",
  "singapore",
  "hongKong",
  "mumbai",
  "berlin",
  "moscow",
  "toronto",
]

export function TimeZoneConverter({ isCustomMode, selectedTime, onTimeUpdate }: TimeZoneConverterProps) {
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [selectedZones, setSelectedZones] = useState<string[]>(["paris", "newYork", "losAngeles"])
  const [heroZone, setHeroZone] = useState<string>("london")
  const [newlyAddedZone, setNewlyAddedZone] = useState<string | null>(null)
  const [draggedZone, setDraggedZone] = useState<string | null>(null)
  const [dropIndicator, setDropIndicator] = useState<{ index: number; side: "left" | "right" } | null>(null)
  const [nudgingZones, setNudgingZones] = useState<{ zone: string; direction: "left" | "right" }[]>([])
  const [justDroppedZone, setJustDroppedZone] = useState<string | null>(null)
  const [mouseDownZone, setMouseDownZone] = useState<string | null>(null)
  const [layout, setLayout] = useState<"grid" | "list">("grid")
  const [temperatures, setTemperatures] = useState<Record<string, { celsius: number; fahrenheit: number }>>({})
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false)
  const dragImageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const localZone = detectLocalTimezone()
    setHeroZone(localZone)
  }, [])

  // Fetch temperatures for all displayed zones when in live mode
  useEffect(() => {
    if (isCustomMode) return

    async function fetchTemperatures() {
      const allZones = [heroZone, ...selectedZones]
      const newTemps: Record<string, { celsius: number; fahrenheit: number }> = {}

      await Promise.all(
        allZones.map(async (zoneKey) => {
          try {
            const response = await fetch(`/api/weather?city=${zoneKey}`)
            if (response.ok) {
              const data = await response.json()
              newTemps[zoneKey] = { celsius: data.celsius, fahrenheit: data.fahrenheit }
            }
          } catch (error) {
            // Silently fail for individual cities
          }
        })
      )

      setTemperatures(newTemps)
    }

    fetchTemperatures()
    // Refresh temperatures every 10 minutes
    const interval = setInterval(fetchTemperatures, 600000)
    return () => clearInterval(interval)
  }, [isCustomMode, heroZone, selectedZones])

  useEffect(() => {
    if (isCustomMode) return

    setCurrentTime(new Date())

    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [isCustomMode])

  function getTimeInZone(utcBaseTime: Date, offsetHours: number): Date {
    return new Date(utcBaseTime.getTime() + offsetHours * 3600000)
  }

  function handleZoneChange(index: number, zoneKey: string) {
    setSelectedZones((prev) => {
      const newZones = [...prev]
      newZones[index] = zoneKey
      return newZones
    })
  }

  function handleAddClock() {
    if (selectedZones.length >= MAX_CLOCKS) return

    const nextZone = AVAILABLE_ZONES.find((zone) => !selectedZones.includes(zone))
    if (nextZone) {
      setSelectedZones((prev) => [nextZone, ...prev])
      setNewlyAddedZone(nextZone)

      setTimeout(() => {
        setNewlyAddedZone(null)
      }, 1500)
    }
  }

  function handleMouseDown(zoneKey: string) {
    setMouseDownZone(zoneKey)
  }

  function handleMouseUp() {
    // Only clear if not dragging
    if (!draggedZone) {
      setMouseDownZone(null)
    }
  }

  function handleDragStart(e: React.DragEvent, index: number) {
    const zoneKey = selectedZones[index]
    setDraggedZone(zoneKey)
    setMouseDownZone(zoneKey)

    if (dragImageRef.current) {
      e.dataTransfer.setDragImage(dragImageRef.current, 0, 0)
    }
    e.dataTransfer.effectAllowed = "move"
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    const draggedIndex = draggedZone ? selectedZones.indexOf(draggedZone) : -1
    if (draggedIndex === -1 || draggedIndex === index) {
      setDropIndicator(null)
      return
    }

    const rect = e.currentTarget.getBoundingClientRect()
    const midpoint = rect.left + rect.width / 2
    const side = e.clientX < midpoint ? "left" : "right"

    setDropIndicator({ index, side })
  }

  function handleDragLeave() {
    setDropIndicator(null)
  }

  function handleDrop(index: number) {
    const draggedIndex = draggedZone ? selectedZones.indexOf(draggedZone) : -1

    if (draggedIndex !== -1 && dropIndicator !== null) {
      let insertIndex = dropIndicator.index
      if (dropIndicator.side === "right") {
        insertIndex = dropIndicator.index + 1
      }
      if (draggedIndex < insertIndex) {
        insertIndex -= 1
      }

      const zonesToNudge: { zone: string; direction: "left" | "right" }[] = []
      if (draggedIndex < insertIndex) {
        for (let i = draggedIndex + 1; i <= insertIndex; i++) {
          zonesToNudge.push({ zone: selectedZones[i], direction: "left" })
        }
      } else if (draggedIndex > insertIndex) {
        for (let i = insertIndex; i < draggedIndex; i++) {
          zonesToNudge.push({ zone: selectedZones[i], direction: "right" })
        }
      }

      setSelectedZones((prev) => {
        const newZones = [...prev]
        const [movedZone] = newZones.splice(draggedIndex, 1)
        newZones.splice(insertIndex, 0, movedZone)
        return newZones
      })

      setNudgingZones(zonesToNudge)
      setDropIndicator(null)
      setJustDroppedZone(draggedZone)

      setDraggedZone(null)
      setMouseDownZone(null)

      setTimeout(() => {
        setNudgingZones([])
      }, 1000)

      setTimeout(() => {
        setJustDroppedZone(null)
      }, 1500)
    } else {
      setDraggedZone(null)
      setMouseDownZone(null)
      setDropIndicator(null)
    }
  }

  function handleDragEnd() {
    setDraggedZone(null)
    setMouseDownZone(null)
    setDropIndicator(null)
  }

  function getBaseTime(): Date {
    if (isCustomMode && selectedTime) {
      return selectedTime
    }
    const now = currentTime || new Date()
    return new Date(now.getTime() + now.getTimezoneOffset() * 60000)
  }

  function getOtherZoneKeys(currentIndex: number): string[] {
    return selectedZones.filter((_, index) => index !== currentIndex)
  }

  const MAX_CLOCKS = 12

  if (!currentTime && !isCustomMode) {
    const heroTz = ALL_TIMEZONES[heroZone as keyof typeof ALL_TIMEZONES]
    return (
      <div className="space-y-16">
        <section>
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">{heroTz.name}</p>
          <p className="mt-1 font-display text-6xl font-black tracking-tight text-foreground md:text-8xl">--:--:--</p>
          <p className="mt-2 text-sm text-muted-foreground">{heroTz.gmtLabel}</p>
        </section>

        <section className="border-t border-gray-300 pt-12">
          <div className="mb-8">
            <Button variant="ghost" size="sm" disabled className="h-8 w-8 p-0 rounded-full border border-gray-300">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {selectedZones.map((zoneKey) => {
              const tz = ALL_TIMEZONES[zoneKey as keyof typeof ALL_TIMEZONES]
              return (
                <div key={zoneKey}>
                  <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">{tz.name}</p>
                  <p className="mt-1 font-display text-3xl font-black tracking-tight text-foreground md:text-4xl">
                    --:--
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{tz.label}</p>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    )
  }

  const baseTime = getBaseTime()
  const heroTimezone = ALL_TIMEZONES[heroZone as keyof typeof ALL_TIMEZONES]

  return (
    <div className="space-y-16">
      <div ref={dragImageRef} className="fixed -top-[9999px] -left-[9999px] w-1 h-1 opacity-0" aria-hidden="true" />

      <section>
        <DigitalClock
          time={getTimeInZone(baseTime, heroTimezone.offset)}
          cityName={heroTimezone.name}
          timezone={heroTimezone.gmtLabel}
          isHero
          showSeconds={!isCustomMode}
          temperature={!isCustomMode ? temperatures[heroZone] : undefined}
          zoneKey={heroZone}
          onTimeUpdate={onTimeUpdate}
        />
      </section>

      <section className="border-t border-gray-300 pt-6">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm uppercase text-muted-foreground">Add Time Zone</span>
            <Button
              size="sm"
              onClick={handleAddClock}
              disabled={selectedZones.length >= MAX_CLOCKS}
              className="h-8 w-8 p-0 rounded-full"
              title={selectedZones.length >= MAX_CLOCKS ? "Maximum 12 clocks reached" : "Add another clock"}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm uppercase text-muted-foreground">View</span>
            <Button
              variant={layout === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setLayout("grid")}
              className="h-8 w-8 p-0 rounded-full"
              title="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={layout === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setLayout("list")}
              className="h-8 w-8 p-0 rounded-full"
              title="List view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className={layout === "grid" ? "grid grid-cols-1 gap-8 md:grid-cols-3" : "flex flex-col gap-4"}>
          {selectedZones.map((zoneKey, index) => {
            const tz = ALL_TIMEZONES[zoneKey as keyof typeof ALL_TIMEZONES]
            const isHighlighted = mouseDownZone === zoneKey || draggedZone === zoneKey
            const isHidden = draggedZone === zoneKey
            const showLeftIndicator = dropIndicator?.index === index && dropIndicator?.side === "left"
            const showRightIndicator = dropIndicator?.index === index && dropIndicator?.side === "right"
            const nudgeInfo = nudgingZones.find((n) => n.zone === zoneKey)
            const nudgeClass = nudgeInfo
              ? layout === "grid"
                ? nudgeInfo.direction === "left"
                  ? "-translate-x-8"
                  : "translate-x-8"
                : nudgeInfo.direction === "left"
                  ? "-translate-y-4"
                  : "translate-y-4"
              : ""

            return (
              <div
                key={zoneKey}
                draggable
                onMouseDown={() => handleMouseDown(zoneKey)}
                onMouseUp={handleMouseUp}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
                className={`relative cursor-grab active:cursor-grabbing transition-all duration-1000 ease-out ${nudgeClass} ${isHidden ? "opacity-0" : ""}`}
              >
                {showLeftIndicator &&
                  (layout === "grid" ? (
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary rounded-full" />
                  ) : (
                    <div className="absolute -top-2 left-0 right-0 h-1 bg-primary rounded-full" />
                  ))}
                {showRightIndicator &&
                  (layout === "grid" ? (
                    <div className="absolute -right-4 top-0 bottom-0 w-1 bg-primary rounded-full" />
                  ) : (
                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-primary rounded-full" />
                  ))}
                <DigitalClock
                  time={getTimeInZone(baseTime, tz.offset)}
                  cityName={tz.name}
                  timezone={tz.gmtLabel}
                  isSelectable
                  allTimezones={ALL_TIMEZONES}
                  selectedZoneKey={zoneKey}
                  onZoneChange={(newZone) => handleZoneChange(index, newZone)}
                  otherZoneKeys={getOtherZoneKeys(index)}
                  isNew={zoneKey === newlyAddedZone || zoneKey === justDroppedZone}
                  isDraggable
                  isBeingDragged={isHighlighted}
                  layout={layout}
                  temperature={!isCustomMode ? temperatures[zoneKey] : undefined}
                  zoneKey={zoneKey}
                  onTimeUpdate={onTimeUpdate}
                />
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
