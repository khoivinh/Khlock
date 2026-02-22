import React, { useState } from "react";
import { GripVertical, X, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MeetingPlannerModal } from "@/components/meeting-planner-modal";
import { ThemeToggle } from "@/components/theme-toggle";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { ALL_CITIES, getCityByKey, searchCities, type TimezoneOption } from "@/lib/city-lookup";
import { useWeather, getTemperatureColor } from "@/hooks/use-weather";

interface DigitalClockProps {
  time: Date;
  cityName: string;
  timezone: string;
  isHero?: boolean;
  showSeconds?: boolean;
  isSelectable?: boolean;
  selectedZoneKey?: string;
  onZoneChange?: (zoneKey: string) => void;
  otherZoneKeys?: string[];
  isNew?: boolean;
  isDraggable?: boolean;
  isBeingDragged?: boolean;
  layout?: "grid" | "list";
  zoneKey?: string;
  onTimeUpdate?: (zoneKey: string, hours: number, minutes: number) => void;
  onRemove?: () => void;
  isDragActive?: boolean;
  dragHandleListeners?: Record<string, unknown>;
}

function CitySelector({ 
  selectedCityKey, 
  onCityChange, 
  onOpenChange 
}: { 
  selectedCityKey: string;
  onCityChange: (cityKey: string) => void;
  onOpenChange: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const selectedCity = getCityByKey(selectedCityKey);
  const filteredCities = searchCities(searchValue, 100);

  return (
    <Popover 
      open={open} 
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        onOpenChange(isOpen);
        if (!isOpen) setSearchValue("");
      }}
    >
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-1 text-sm font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors focus:outline-none min-h-[44px] touch-manipulation"
          data-testid="button-city-selector"
        >
          {selectedCity?.name || "Select city"}
          <ChevronsUpDown className="h-3 w-3 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start" collisionPadding={20}>
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Search cities..." 
            value={searchValue}
            onValueChange={setSearchValue}
            data-testid="input-city-search"
          />
          <CommandList>
            <CommandEmpty>No cities found.</CommandEmpty>
            <CommandGroup>
              {filteredCities.map((city) => (
                <CommandItem
                  key={city.key}
                  value={city.key}
                  onSelect={() => {
                    onCityChange(city.key);
                    setOpen(false);
                    setSearchValue("");
                  }}
                  data-testid={`city-option-${city.key}`}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCityKey === city.key ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{city.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {city.country} ({city.gmtLabel})
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
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
  dragHandleListeners,
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
        ${isDragActive ? "transition-none" : "transition-[background-color,box-shadow,opacity] duration-300 ease-out"}
        ${isEditing ? "bg-muted shadow-lg ring-2 ring-primary/20" : isDropdownOpen ? "bg-muted shadow-lg" : isDragActive ? "shadow-none bg-transparent" : "hover:bg-muted hover:shadow-lg"}
        ${isNew ? "animate-highlight-yellow" : ""}
        ${isBeingDragged ? "bg-yellow-200 dark:bg-yellow-800/50 shadow-lg" : ""}`}
        data-testid={`clock-tile-${selectedZoneKey}`}
      >
        <div className="flex items-start gap-6 py-10">
          {isDraggable && (
            <div
              className="flex items-center justify-center min-h-[44px] min-w-[44px] -ml-2 text-muted-foreground/40 hover:text-muted-foreground transition-colors cursor-grab active:cursor-grabbing touch-none"
              {...(dragHandleListeners as React.HTMLAttributes<HTMLDivElement>)}
              title="Drag to reorder"
            >
              <GripVertical className="h-5 w-5" />
            </div>
          )}

          <div className="w-32">
            {isSelectable && selectedZoneKey && onZoneChange ? (
              <CitySelector 
                selectedCityKey={selectedZoneKey} 
                onCityChange={onZoneChange}
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
              size="icon"
              className="ml-auto min-h-[44px] min-w-[44px] text-muted-foreground/50 hover:text-destructive touch-manipulation"
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
      ${isDragActive ? "transition-none" : "transition-[background-color,box-shadow,opacity,transform] duration-300 ease-out"}
      ${
        isEditing
          ? "bg-muted shadow-lg ring-2 ring-primary/20"
          : isDropdownOpen
            ? "[@media(hover:hover)]:scale-110 bg-muted shadow-lg [@media(hover:hover)]:-translate-y-1"
            : isDragActive
              ? "scale-100 translate-y-0 shadow-none bg-transparent" // Force reset any hover states during drag
              : "[@media(hover:hover)]:hover:scale-110 hover:bg-muted hover:shadow-lg [@media(hover:hover)]:hover:-translate-y-1"
      }
      ${isNew ? "animate-highlight-yellow" : ""}
      ${isBeingDragged ? "bg-yellow-200 dark:bg-yellow-800/50 shadow-lg scale-105" : ""}`}
      data-testid={`clock-tile-${selectedZoneKey}`}
    >
      {isDraggable && (
        <div
          className="absolute top-0 left-0 flex items-center justify-center h-11 w-11 text-muted-foreground/40 hover:text-muted-foreground transition-colors cursor-grab active:cursor-grabbing touch-none"
          {...(dragHandleListeners as React.HTMLAttributes<HTMLDivElement>)}
          title="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </div>
      )}

      {onRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-0 min-h-[44px] min-w-[44px] text-muted-foreground/50 hover:text-destructive touch-manipulation"
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
            selectedCityKey={selectedZoneKey} 
            onCityChange={onZoneChange}
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
