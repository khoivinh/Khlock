"use client"

import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <Monitor className="h-4 w-4" />
      </Button>
    )
  }

  // Cycle through: system -> light -> dark -> system
  const cycleTheme = () => {
    if (theme === "system") {
      setTheme("light")
    } else if (theme === "light") {
      setTheme("dark")
    } else {
      setTheme("system")
    }
  }

  // Choose icon based on current theme setting
  const getIcon = () => {
    if (theme === "system") return <Monitor className="h-4 w-4" />
    if (theme === "light") return <Sun className="h-4 w-4" />
    return <Moon className="h-4 w-4" />
  }

  // Accessible label describing current state
  const getLabel = () => {
    if (theme === "system") return "Using system theme, click to switch to light"
    if (theme === "light") return "Using light theme, click to switch to dark"
    return "Using dark theme, click to switch to system"
  }

  return (
    <Button variant="ghost" size="icon" className="h-9 w-9" onClick={cycleTheme} aria-label={getLabel()}>
      {getIcon()}
    </Button>
  )
}
