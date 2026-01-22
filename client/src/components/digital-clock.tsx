import { useState, useMemo } from "react";
import { GripVertical, X, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MeetingPlannerModal } from "@/components/meeting-planner-modal";
import { ThemeToggle } from "@/components/theme-toggle";
import { ALL_TIMEZONES, AVAILABLE_ZONES, type TimezoneKey } from "@shared/schema";
import { useWeather, getTemperatureColor } from "@/hooks/use-weather";

interface DigitalClockProps {
  time: Date;
  cityName: string;
  timezone: string;
  isHero?: boolean;
  showSeconds?: boolean;
  isSelectable?: boolean;
  selectedZoneKey?: TimezoneKey;
  onZoneChange?: (zoneKey: TimezoneKey) => void;
  otherZoneKeys?: TimezoneKey[];
  isNew?: boolean;
  isDraggable?: boolean;
  isBeingDragged?: boolean;
  layout?: "grid" | "list";
  zoneKey?: TimezoneKey;
  onTimeUpdate?: (zoneKey: TimezoneKey, hours: number, minutes: number) => void;
  onRemove?: () => void;
  isDragActive?: boolean;
}

function CitySelector({ 
  selectedZoneKey, 
  onZoneChange, 
  onOpenChange 
}: { 
  selectedZoneKey: TimezoneKey;
  onZoneChange: (zoneKey: TimezoneKey) => void;
  onOpenChange: (open: boolean) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTimezones = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    if (!query) {
      // No search - show AVAILABLE_ZONES sorted by offset
      return AVAILABLE_ZONES
        .map(key => [key, ALL_TIMEZONES[key]] as [string, typeof ALL_TIMEZONES[TimezoneKey]])
        .sort((a, b) => b[1].offset - a[1].offset);
    }
    
    // With search - filter ALL_TIMEZONES
    return Object.entries(ALL_TIMEZONES)
      .filter(([key, tz]) => 
        tz.name.toLowerCase().includes(query) || 
        tz.gmtLabel.toLowerCase().includes(query) ||
        key.toLowerCase().includes(query)
      )
      .sort((a, b) => b[1].offset - a[1].offset);
  }, [searchQuery]);

  return (
    <Select 
      value={selectedZoneKey} 
      onValueChange={(val) => {
        onZoneChange(val as TimezoneKey);
        setSearchQuery("");
      }} 
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) setSearchQuery("");
      }}
    >
      <SelectTrigger className="w-fit h-auto p-0 border-0 bg-transparent text-sm font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground focus:ring-0 focus:ring-offset-0 gap-1">
        <SelectValue>{ALL_TIMEZONES[selectedZoneKey]?.name}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <div className="flex items-center gap-2 px-2 pb-2 sticky top-0 bg-popover">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 text-sm"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            data-testid="input-city-search"
          />
        </div>
        {filteredTimezones.map(([key, tz]) => (
          <SelectItem key={key} value={key}>
            {tz.name} ({tz.gmtLabel})
          </SelectItem>
        ))}
        {filteredTimezones.length === 0 && (
          <div className="py-2 px-4 text-sm text-muted-foreground">
            No cities found
          </div>
        )}
      </SelectContent>
    </Select>
  );
}

export function DigitalClock({
  time,
  cityName,
  timezone,
  isHero = false,
  showSeconds = false,
  isSelectable = false,
  selectedZoneKey,
  onZoneChange,
  otherZoneKeys = [],
  isNew = false,
  isDraggable = false,
  isBeingDragged = false,
  layout = "grid",
  zoneKey,
  onTimeUpdate,
  onRemove,
  isDragActive = false,
}: DigitalClockProps) {
  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  const timeString = showSeconds ? `${hours}:${minutes}:${seconds}` : `${hours}:${minutes}`;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTime, setEditTime] = useState("");

  // Fetch weather data for this timezone
  const { data: weather } = useWeather(zoneKey || selectedZoneKey);

  function handleTimeClick() {
    if (onTimeUpdate && zoneKey) {
      const currentTime = `${hours}:${minutes}`;
      setEditTime(currentTime);
      setIsEditing(true);
    }
  }

  function handleUpdateClick() {
    if (onTimeUpdate && zoneKey && editTime) {
      const [h, m] = editTime.split(":").map(Number);
      onTimeUpdate(zoneKey, h, m);
      setIsEditing(false);
    }
  }

  function handleCancelEdit() {
    setIsEditing(false);
    setEditTime("");
  }

  if (isHero) {
    return (
      <div className="flex items-start justify-between">
        <div>
          <p 
            className="text-sm font-medium uppercase tracking-wide text-muted-foreground"
            data-testid="text-hero-city"
          >
            {cityName}
          </p>
          {isEditing ? (
            <div className="mt-1 flex items-center gap-4 flex-wrap">
              <Input
                type="time"
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
                className="font-display text-4xl font-black h-auto py-2 px-3 w-48"
                autoFocus
                data-testid="input-edit-time"
              />
              <Button onClick={handleUpdateClick} data-testid="button-update-clock">
                Update Clock
              </Button>
              <Button variant="ghost" onClick={handleCancelEdit} data-testid="button-cancel-edit">
                Cancel
              </Button>
            </div>
          ) : (
            <p
              className="mt-1 font-display text-6xl font-black tracking-tight text-foreground md:text-8xl cursor-pointer hover:text-primary transition-colors"
              onClick={handleTimeClick}
              title="Click to edit time"
              data-testid="text-hero-time"
            >
              {timeString}
            </p>
          )}
          <p 
            className="mt-2 text-sm text-muted-foreground"
            data-testid="text-hero-timezone"
          >
            {timezone}
            {weather && (
              <span className={`ml-2 ${getTemperatureColor(weather.celsius)}`} data-testid="text-hero-temperature">
                {weather.fahrenheit}°F / {weather.celsius}°C
              </span>
            )}
          </p>
        </div>
        <ThemeToggle />
      </div>
    );
  }

  if (layout === "list") {
    return (
      <div
        className={`relative rounded-lg p-4 -m-4 
        ${isDragActive ? "transition-none" : "transition-all duration-300 ease-out"}
        ${isEditing ? "bg-muted shadow-lg ring-2 ring-primary/20" : isDropdownOpen ? "bg-muted shadow-lg" : isDragActive ? "shadow-none bg-transparent" : "hover:bg-muted hover:shadow-lg"}
        ${isNew ? "animate-highlight-yellow" : ""}
        ${isBeingDragged ? "bg-yellow-200 dark:bg-yellow-800/50 shadow-lg" : ""}`}
        data-testid={`clock-tile-${selectedZoneKey}`}
      >
        <div className="flex items-center gap-6 py-10">
          {isDraggable && (
            <div className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
              <GripVertical className="h-4 w-4" />
            </div>
          )}

          <div className="w-32">
            {isSelectable && selectedZoneKey && onZoneChange ? (
              <CitySelector 
                selectedZoneKey={selectedZoneKey} 
                onZoneChange={onZoneChange}
                onOpenChange={setIsDropdownOpen}
              />
            ) : (
              <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                {cityName}
              </p>
            )}
          </div>

          {isEditing ? (
            <div className="flex items-center gap-4">
              <Input
                type="time"
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
                className="font-display text-3xl font-black h-14 px-4 w-40"
                autoFocus
              />
              <Button onClick={handleUpdateClick}>Update Clock</Button>
              <Button variant="ghost" onClick={handleCancelEdit}>Cancel</Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <p
                className={`font-display text-6xl font-black tracking-tight text-foreground cursor-pointer transition-colors ${isDragActive ? "" : "hover:text-primary"}`}
                onClick={handleTimeClick}
                title="Click to edit time"
              >
                {timeString}
              </p>
              {selectedZoneKey && otherZoneKeys.length > 0 && (
                <MeetingPlannerModal hostZoneKey={selectedZoneKey} otherZoneKeys={otherZoneKeys} />
              )}
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            {timezone}
            {weather && (
              <span className={`ml-2 ${getTemperatureColor(weather.celsius)}`} data-testid={`text-temp-${selectedZoneKey}`}>
                {weather.fahrenheit}°F / {weather.celsius}°C
              </span>
            )}
          </p>

          {onRemove && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto h-7 w-7 p-0 text-muted-foreground/50 hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              title="Remove clock"
              data-testid={`button-remove-${selectedZoneKey}`}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Grid layout
  return (
    <div
      className={`relative rounded-lg p-4 -m-4 mr-4 
      ${isDragActive ? "transition-none" : "transition-all duration-300 ease-out"}
      ${
        isEditing
          ? "bg-muted shadow-lg ring-2 ring-primary/20"
          : isDropdownOpen
            ? "scale-110 bg-muted shadow-lg -translate-y-1"
            : isDragActive
              ? "scale-100 translate-y-0 shadow-none bg-transparent" // Force reset any hover states during drag
              : "hover:scale-110 hover:bg-muted hover:shadow-lg hover:-translate-y-1"
      }
      ${isNew ? "animate-highlight-yellow" : ""}
      ${isBeingDragged ? "bg-yellow-200 dark:bg-yellow-800/50 shadow-lg scale-105" : ""}`}
      data-testid={`clock-tile-${selectedZoneKey}`}
    >
      {isDraggable && (
        <div className="absolute top-4 left-2 text-muted-foreground/50 hover:text-muted-foreground transition-colors">
          <GripVertical className="h-4 w-4" />
        </div>
      )}

      {onRemove && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-2 h-7 w-7 p-0 text-muted-foreground/50 hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          title="Remove clock"
          data-testid={`button-remove-${selectedZoneKey}`}
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <div className="pl-6">
        {isSelectable && selectedZoneKey && onZoneChange ? (
          <CitySelector 
            selectedZoneKey={selectedZoneKey} 
            onZoneChange={onZoneChange}
            onOpenChange={setIsDropdownOpen}
          />
        ) : (
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {cityName}
          </p>
        )}

        {isEditing ? (
          <div className="mt-2 space-y-3 pb-2">
            <Input
              type="time"
              value={editTime}
              onChange={(e) => setEditTime(e.target.value)}
              className="font-display text-2xl font-black h-12 px-3 w-full max-w-[140px]"
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleUpdateClick} className="flex-1">
                Update
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-1 flex items-center gap-2">
            <p
              className={`font-display text-3xl font-black tracking-tight text-foreground md:text-4xl cursor-pointer transition-colors ${isDragActive ? "" : "hover:text-primary"}`}
              onClick={handleTimeClick}
              title="Click to edit time"
            >
              {timeString}
            </p>
            {selectedZoneKey && otherZoneKeys.length > 0 && (
              <MeetingPlannerModal hostZoneKey={selectedZoneKey} otherZoneKeys={otherZoneKeys} />
            )}
          </div>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          {timezone}
          {weather && (
            <span className={`ml-2 ${getTemperatureColor(weather.celsius)}`} data-testid={`text-temp-${selectedZoneKey}`}>
              {weather.fahrenheit}°F / {weather.celsius}°C
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
