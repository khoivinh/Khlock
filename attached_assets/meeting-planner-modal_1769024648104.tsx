"use client"

import { useState, useEffect } from "react"
import { CalendarClock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ALL_TIMEZONES } from "@/components/time-input"

interface MeetingPlannerModalProps {
  hostZoneKey: string
  otherZoneKeys: string[]
}

export function MeetingPlannerModal({ hostZoneKey, otherZoneKeys }: MeetingPlannerModalProps) {
  const [meetingDate, setMeetingDate] = useState("")
  const [meetingTime, setMeetingTime] = useState("")

  const hostZone = ALL_TIMEZONES[hostZoneKey as keyof typeof ALL_TIMEZONES]

  useEffect(() => {
    // Get current time in the host timezone
    const now = new Date()
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000
    const hostTime = new Date(utcTime + hostZone.offset * 3600000)

    // If it's after 6pm in the host timezone, default to tomorrow
    let defaultDate = hostTime
    if (hostTime.getHours() >= 18) {
      defaultDate = new Date(hostTime.getTime() + 24 * 3600000)
    }

    // Format as YYYY-MM-DD for the date input
    const year = defaultDate.getFullYear()
    const month = (defaultDate.getMonth() + 1).toString().padStart(2, "0")
    const day = defaultDate.getDate().toString().padStart(2, "0")

    setMeetingDate(`${year}-${month}-${day}`)
  }, [hostZone.offset])

  // Calculate meeting times for other zones
  function getMeetingTimeInZone(targetZoneKey: string): { time: string; hour: number } | null {
    if (!meetingDate || !meetingTime) return null

    const targetZone = ALL_TIMEZONES[targetZoneKey as keyof typeof ALL_TIMEZONES]
    const [hours, minutes] = meetingTime.split(":").map(Number)

    // Calculate the offset difference
    const offsetDiff = targetZone.offset - hostZone.offset

    // Create a date object for calculation
    const meetingDateTime = new Date(`${meetingDate}T${meetingTime}:00`)
    const targetDateTime = new Date(meetingDateTime.getTime() + offsetDiff * 3600000)

    const targetHours = targetDateTime.getHours()
    const targetMinutes = targetDateTime.getMinutes().toString().padStart(2, "0")
    const formattedHours = targetHours.toString().padStart(2, "0")

    return {
      time: `${formattedHours}:${targetMinutes}`,
      hour: targetHours,
    }
  }

  // Determine if a time is good (6am-9pm) or bad (night time)
  function getTimeStatus(hour: number): "good" | "bad" | "neutral" {
    if (hour >= 6 && hour < 21) return "good"
    return "bad"
  }

  function getStatusColor(status: "good" | "bad" | "neutral") {
    switch (status) {
      case "good":
        return "bg-green-500"
      case "bad":
        return "bg-red-500"
      default:
        return "bg-gray-400"
    }
  }

  function getStatusLabel(status: "good" | "bad" | "neutral") {
    switch (status) {
      case "good":
        return "Good time"
      case "bad":
        return "Night time"
      default:
        return ""
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Plan a meeting"
        >
          <CalendarClock className="size-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display font-semibold">Meeting Time Zone Calculations</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Host timezone info */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Planning meeting from</p>
            <p className="font-display font-semibold text-lg">
              {hostZone.name} ({hostZone.gmtLabel})
            </p>
          </div>

          {/* Date and time inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Date</label>
              <Input type="date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Time</label>
              <Input type="time" value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} />
            </div>
          </div>

          {/* Meeting times for other zones */}
          {meetingDate && meetingTime && (
            <div className="space-y-3 pt-4 border-t">
              <p className="text-sm text-muted-foreground">Meeting times for others</p>

              {otherZoneKeys.map((zoneKey) => {
                const zone = ALL_TIMEZONES[zoneKey as keyof typeof ALL_TIMEZONES]
                const meetingInfo = getMeetingTimeInZone(zoneKey)

                if (!meetingInfo) return null

                const status = getTimeStatus(meetingInfo.hour)

                return (
                  <div key={zoneKey} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      {/* Status indicator */}
                      <div className={`size-3 rounded-full ${getStatusColor(status)}`} title={getStatusLabel(status)} />
                      <div>
                        <p className="font-medium">{zone.name}</p>
                        <p className="text-xs text-muted-foreground">{zone.gmtLabel}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-semibold text-xl">{meetingInfo.time}</p>
                      <p className="text-xs text-muted-foreground">{getStatusLabel(status)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Legend */}
          {meetingDate && meetingTime && (
            <div className="flex gap-4 text-xs text-muted-foreground pt-2">
              <div className="flex items-center gap-1">
                <div className="size-2 rounded-full bg-green-500" />
                <span>6am - 9pm</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="size-2 rounded-full bg-red-500" />
                <span>Night time</span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
