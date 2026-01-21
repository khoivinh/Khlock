"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const ALL_TIMEZONES = {
  auckland: { name: "Auckland", label: "NZST / NZDT", offset: 12, gmtLabel: "GMT+12" },
  sydney: { name: "Sydney", label: "AEST / AEDT", offset: 10, gmtLabel: "GMT+10" },
  tokyo: { name: "Tokyo", label: "JST", offset: 9, gmtLabel: "GMT+9" },
  seoul: { name: "Seoul", label: "KST", offset: 9, gmtLabel: "GMT+9" },
  hongKong: { name: "Hong Kong", label: "HKT", offset: 8, gmtLabel: "GMT+8" },
  singapore: { name: "Singapore", label: "SGT", offset: 8, gmtLabel: "GMT+8" },
  bangkok: { name: "Bangkok", label: "ICT", offset: 7, gmtLabel: "GMT+7" },
  jakarta: { name: "Jakarta", label: "WIB", offset: 7, gmtLabel: "GMT+7" },
  mumbai: { name: "Mumbai", label: "IST", offset: 5.5, gmtLabel: "GMT+5:30" },
  dubai: { name: "Dubai", label: "GST", offset: 4, gmtLabel: "GMT+4" },
  moscow: { name: "Moscow", label: "MSK", offset: 3, gmtLabel: "GMT+3" },
  cairo: { name: "Cairo", label: "EET", offset: 2, gmtLabel: "GMT+2" },
  johannesburg: { name: "Johannesburg", label: "SAST", offset: 2, gmtLabel: "GMT+2" },
  berlin: { name: "Berlin", label: "CET / CEST", offset: 1, gmtLabel: "GMT+1" },
  paris: { name: "Paris", label: "CET / CEST", offset: 1, gmtLabel: "GMT+1" },
  london: { name: "London", label: "GMT / BST", offset: 0, gmtLabel: "GMT+0" },
  saoPaulo: { name: "São Paulo", label: "BRT", offset: -3, gmtLabel: "GMT-3" },
  newYork: { name: "New York", label: "EST / EDT", offset: -5, gmtLabel: "GMT-5" },
  toronto: { name: "Toronto", label: "EST / EDT", offset: -5, gmtLabel: "GMT-5" },
  chicago: { name: "Chicago", label: "CST / CDT", offset: -6, gmtLabel: "GMT-6" },
  denver: { name: "Denver", label: "MST / MDT", offset: -7, gmtLabel: "GMT-7" },
  losAngeles: { name: "Los Angeles", label: "PST / PDT", offset: -8, gmtLabel: "GMT-8" },
  vancouver: { name: "Vancouver", label: "PST / PDT", offset: -8, gmtLabel: "GMT-8" },
}

export function getSortedTimezones() {
  return Object.entries(ALL_TIMEZONES).sort((a, b) => b[1].offset - a[1].offset)
}

export function detectLocalTimezone(): string {
  const localOffset = -(new Date().getTimezoneOffset() / 60)
  const entries = Object.entries(ALL_TIMEZONES)
  const match = entries.find(([_, tz]) => tz.offset === localOffset)
  if (match) return match[0]
  return "london"
}

interface TimeInputProps {
  customTime: string
  setCustomTime: (time: string) => void
  referenceZone: string
  setReferenceZone: (zone: string) => void
  isCustomMode: boolean
  onUpdateTime: () => void
  onReset: () => void
}

export function TimeInput({
  customTime,
  setCustomTime,
  referenceZone,
  setReferenceZone,
  isCustomMode,
  onUpdateTime,
  onReset,
}: TimeInputProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="sm:max-w-48">
        <Select value={referenceZone} onValueChange={setReferenceZone}>
          <SelectTrigger className="h-auto border-none p-0 text-sm font-medium uppercase tracking-wide text-muted-foreground shadow-none focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {getSortedTimezones().map(([key, tz]) => (
              <SelectItem key={key} value={key}>
                {tz.name} ({tz.gmtLabel})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input type="time" value={customTime} onChange={(e) => setCustomTime(e.target.value)} className="mt-2" />
      </div>

      <div className="flex gap-3">
        <Button onClick={onUpdateTime} disabled={!customTime}>
          Update Clocks
        </Button>

        {isCustomMode && (
          <Button variant="outline" onClick={onReset}>
            Show Live Time
          </Button>
        )}
      </div>
    </div>
  )
}
