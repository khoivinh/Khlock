import { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { Globe } from "lucide-react";
import { HeroClock } from "@/components/hero-clock";
import { ClockTile } from "@/components/clock-tile";
import { AddTimezoneDialog } from "@/components/add-timezone-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Timezone } from "@shared/schema";

const STORAGE_KEY = "world-clock-timezones";
const HERO_STORAGE_KEY = "world-clock-hero";

const DEFAULT_TIMEZONES: Timezone[] = [
  { id: "1", city: "Paris", timezone: "Europe/Paris", gmtOffset: "GMT+1", order: 0 },
  { id: "2", city: "New York", timezone: "America/New_York", gmtOffset: "GMT-5", order: 1 },
  { id: "3", city: "Los Angeles", timezone: "America/Los_Angeles", gmtOffset: "GMT-8", order: 2 },
];

const DEFAULT_HERO = {
  city: "New York",
  timezone: "America/New_York",
  gmtOffset: "GMT-5",
};

export default function WorldClock() {
  const [timezones, setTimezones] = useState<Timezone[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return DEFAULT_TIMEZONES;
      }
    }
    return DEFAULT_TIMEZONES;
  });

  const [heroTimezone, setHeroTimezone] = useState(() => {
    const stored = localStorage.getItem(HERO_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return DEFAULT_HERO;
      }
    }
    return DEFAULT_HERO;
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timezones));
  }, [timezones]);

  useEffect(() => {
    localStorage.setItem(HERO_STORAGE_KEY, JSON.stringify(heroTimezone));
  }, [heroTimezone]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTimezones((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        return newItems.map((item, index) => ({ ...item, order: index }));
      });
    }
  }, []);

  const handleAddTimezone = useCallback((city: string, timezone: string, gmtOffset: string) => {
    const newTimezone: Timezone = {
      id: crypto.randomUUID(),
      city,
      timezone,
      gmtOffset,
      order: timezones.length,
    };
    setTimezones((prev) => [...prev, newTimezone]);
  }, [timezones.length]);

  const handleRemoveTimezone = useCallback((id: string) => {
    setTimezones((prev) => {
      const filtered = prev.filter((tz) => tz.id !== id);
      return filtered.map((item, index) => ({ ...item, order: index }));
    });
  }, []);

  const handleViewTimezone = useCallback((timezone: Timezone) => {
    setHeroTimezone({
      city: timezone.city,
      timezone: timezone.timezone,
      gmtOffset: timezone.gmtOffset,
    });
  }, []);

  const existingCities = timezones.map((tz) => tz.city);
  const selectedTileId = timezones.find(
    (tz) => tz.timezone === heroTimezone.timezone
  )?.id;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Globe className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold text-foreground" data-testid="text-app-title">
              World Clock
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <AddTimezoneDialog onAdd={handleAddTimezone} existingCities={existingCities} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="mb-10">
          <HeroClock
            city={heroTimezone.city}
            timezone={heroTimezone.timezone}
            gmtOffset={heroTimezone.gmtOffset}
          />
        </section>

        <section>
          <h2 className="text-lg font-medium text-muted-foreground mb-4" data-testid="text-section-title">
            Your Time Zones
          </h2>
          
          {timezones.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-lg" data-testid="empty-state">
              <Globe className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground mb-4">No time zones added yet</p>
              <AddTimezoneDialog onAdd={handleAddTimezone} existingCities={existingCities} />
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={timezones.map((tz) => tz.id)}
                strategy={rectSortingStrategy}
              >
                <div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  data-testid="grid-clock-tiles"
                >
                  {timezones.map((timezone) => (
                    <ClockTile
                      key={timezone.id}
                      timezone={timezone}
                      onRemove={handleRemoveTimezone}
                      onView={handleViewTimezone}
                      isSelected={timezone.id === selectedTileId}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </section>
      </main>

      <footer className="mt-auto border-t">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          Drag and drop tiles to reorder. Click the eye icon to view a city in the main clock.
        </div>
      </footer>
    </div>
  );
}
