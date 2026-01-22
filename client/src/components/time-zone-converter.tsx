import { useState, useEffect, useCallback, useMemo } from "react";
import { LayoutGrid, List, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DigitalClock } from "@/components/digital-clock";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragCancelEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  ALL_TIMEZONES, 
  AVAILABLE_ZONES, 
  detectLocalTimezone, 
  getTimeInZone,
  type TimezoneKey 
} from "@shared/schema";

interface TimeZoneConverterProps {
  isCustomMode: boolean;
  selectedTime: Date | null;
  onTimeUpdate: (zoneKey: TimezoneKey, hours: number, minutes: number) => void;
}

interface SortableClockItemProps {
  id: TimezoneKey;
  zoneKey: TimezoneKey;
  index: number;
  baseTime: Date;
  layout: "grid" | "list";
  isNew: boolean;
  onZoneChange: (index: number, zoneKey: TimezoneKey) => void;
  otherZoneKeys: TimezoneKey[];
  onTimeUpdate: (zoneKey: TimezoneKey, hours: number, minutes: number) => void;
  onRemove: (zoneKey: TimezoneKey) => void;
  allZones: TimezoneKey[];
  isDragActive: boolean;
}

function SortableClockItem({
  id,
  zoneKey,
  index,
  baseTime,
  layout,
  isNew,
  onZoneChange,
  otherZoneKeys,
  onTimeUpdate,
  onRemove,
  allZones,
  isDragActive,
}: SortableClockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    active,
    over,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const tz = ALL_TIMEZONES[zoneKey];

  // Calculate indicator position based on drag direction
  const activeIndex = active ? allZones.indexOf(active.id as TimezoneKey) : -1;
  const overIndex = over ? allZones.indexOf(over.id as TimezoneKey) : -1;
  const isBeingHoveredOver = over?.id === id && active?.id !== id;
  
  // Show indicator on the side where the item will be inserted
  const showBeforeIndicator = isBeingHoveredOver && activeIndex > overIndex;
  const showAfterIndicator = isBeingHoveredOver && activeIndex < overIndex;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative cursor-grab active:cursor-grabbing touch-none`}
      data-testid={`draggable-zone-${zoneKey}`}
    >
      {showBeforeIndicator && (
        layout === "grid" ? (
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary rounded-full" />
        ) : (
          <div className="absolute -top-2 left-0 right-0 h-1 bg-primary rounded-full" />
        )
      )}
      {showAfterIndicator && (
        layout === "grid" ? (
          <div className="absolute -right-4 top-0 bottom-0 w-1 bg-primary rounded-full" />
        ) : (
          <div className="absolute -bottom-2 left-0 right-0 h-1 bg-primary rounded-full" />
        )
      )}

      <DigitalClock
        time={getTimeInZone(baseTime, tz.offset)}
        cityName={tz.name}
        timezone={tz.gmtLabel}
        isSelectable
        selectedZoneKey={zoneKey}
        onZoneChange={(newZone) => onZoneChange(index, newZone)}
        otherZoneKeys={otherZoneKeys}
        isNew={isNew}
        isDraggable
        isBeingDragged={isDragging}
        layout={layout}
        zoneKey={zoneKey}
        onTimeUpdate={onTimeUpdate}
        onRemove={() => onRemove(zoneKey)}
        isDragActive={isDragActive}
      />
    </div>
  );
}

const MAX_CLOCKS = 12;
const STORAGE_KEY = "world-clock-zones";

export function TimeZoneConverter({ isCustomMode, selectedTime, onTimeUpdate }: TimeZoneConverterProps) {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [selectedZones, setSelectedZones] = useState<TimezoneKey[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return ["paris", "newYork", "losAngeles"];
      }
    }
    return ["paris", "newYork", "losAngeles"];
  });
  const [heroZone, setHeroZone] = useState<TimezoneKey>("london");
  const [newlyAddedZone, setNewlyAddedZone] = useState<TimezoneKey | null>(null);
  const [activeId, setActiveId] = useState<TimezoneKey | null>(null);
  const [layout, setLayout] = useState<"grid" | "list">("grid");

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
    const localZone = detectLocalTimezone();
    setHeroZone(localZone);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedZones));
  }, [selectedZones]);

  useEffect(() => {
    if (isCustomMode) return;

    setCurrentTime(new Date());

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [isCustomMode]);

  const handleZoneChange = useCallback((index: number, zoneKey: TimezoneKey) => {
    setSelectedZones((prev) => {
      const newZones = [...prev];
      newZones[index] = zoneKey;
      return newZones;
    });
  }, []);

  const handleAddClock = useCallback((zoneKey: TimezoneKey) => {
    if (selectedZones.length >= MAX_CLOCKS) return;
    if (selectedZones.includes(zoneKey)) return;

    setSelectedZones((prev) => [zoneKey, ...prev]);
    setNewlyAddedZone(zoneKey);

    setTimeout(() => {
      setNewlyAddedZone(null);
    }, 1500);
  }, [selectedZones]);

  const handleRemoveClock = useCallback((zoneKey: TimezoneKey) => {
    setSelectedZones((prev) => prev.filter((z) => z !== zoneKey));
  }, []);

  const [addZoneSearchQuery, setAddZoneSearchQuery] = useState("");
  
  const filteredZonesToAdd = useMemo(() => {
    const query = addZoneSearchQuery.toLowerCase().trim();
    
    if (!query) {
      // No search - show AVAILABLE_ZONES not already selected
      return AVAILABLE_ZONES
        .filter((zone) => !selectedZones.includes(zone))
        .map(key => [key, ALL_TIMEZONES[key]] as [TimezoneKey, typeof ALL_TIMEZONES[TimezoneKey]])
        .sort((a, b) => b[1].offset - a[1].offset);
    }
    
    // With search - filter ALL_TIMEZONES (excluding already selected)
    return (Object.entries(ALL_TIMEZONES) as [TimezoneKey, typeof ALL_TIMEZONES[TimezoneKey]][])
      .filter(([key, tz]) => 
        !selectedZones.includes(key) &&
        (tz.name.toLowerCase().includes(query) || 
         tz.gmtLabel.toLowerCase().includes(query) ||
         key.toLowerCase().includes(query))
      )
      .sort((a, b) => b[1].offset - a[1].offset);
  }, [addZoneSearchQuery, selectedZones]);

  const canAddMoreZones = selectedZones.length < MAX_CLOCKS;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as TimezoneKey);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    setActiveId(null);

    if (over && active.id !== over.id) {
      setSelectedZones((items) => {
        const oldIndex = items.indexOf(active.id as TimezoneKey);
        const newIndex = items.indexOf(over.id as TimezoneKey);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  function handleDragCancel(_event: DragCancelEvent) {
    setActiveId(null);
  }

  function getBaseTime(): Date {
    if (isCustomMode && selectedTime) {
      return selectedTime;
    }
    const now = currentTime || new Date();
    return new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  }

  function getOtherZoneKeys(currentIndex: number): TimezoneKey[] {
    return selectedZones.filter((_, index) => index !== currentIndex);
  }

  if (!currentTime && !isCustomMode) {
    const heroTz = ALL_TIMEZONES[heroZone];
    return (
      <div className="space-y-16">
        <section>
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {heroTz.name}
          </p>
          <p className="mt-1 font-display text-6xl font-black tracking-tight text-foreground md:text-8xl">
            --:--:--
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{heroTz.gmtLabel}</p>
        </section>

        <section className="border-t border-border pt-12">
          <div className="mb-8">
            <Button variant="ghost" size="icon" disabled className="h-8 w-8 rounded-full border border-border">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {selectedZones.map((zoneKey) => {
              const tz = ALL_TIMEZONES[zoneKey];
              return (
                <div key={zoneKey}>
                  <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    {tz.name}
                  </p>
                  <p className="mt-1 font-display text-3xl font-black tracking-tight text-foreground md:text-4xl">
                    --:--
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{tz.label}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  const baseTime = getBaseTime();
  const heroTimezone = ALL_TIMEZONES[heroZone];
  const activeZone = activeId ? ALL_TIMEZONES[activeId] : null;

  return (
    <div className="space-y-16">
      <section>
        <DigitalClock
          time={getTimeInZone(baseTime, heroTimezone.offset)}
          cityName={heroTimezone.name}
          timezone={heroTimezone.gmtLabel}
          isHero
          showSeconds={!isCustomMode}
          zoneKey={heroZone}
          onTimeUpdate={onTimeUpdate}
        />
      </section>

      <section className="border-t border-border pt-6">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Select 
              value="" 
              onValueChange={(val) => {
                handleAddClock(val as TimezoneKey);
                setAddZoneSearchQuery("");
              }}
              onOpenChange={(open) => { if (!open) setAddZoneSearchQuery(""); }}
              disabled={!canAddMoreZones}
            >
              <SelectTrigger 
                className="w-fit h-auto p-0 border-0 bg-transparent text-sm font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground focus:ring-0 focus:ring-offset-0 gap-1"
                data-testid="button-add-timezone"
              >
                <SelectValue placeholder="Add Time Zone" />
              </SelectTrigger>
              <SelectContent>
                <div className="flex items-center gap-2 px-2 pb-2 sticky top-0 bg-popover">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search cities..."
                    value={addZoneSearchQuery}
                    onChange={(e) => setAddZoneSearchQuery(e.target.value)}
                    className="h-8 text-sm"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    data-testid="input-add-zone-search"
                  />
                </div>
                {filteredZonesToAdd.map(([zoneKey, tz]) => (
                  <SelectItem key={zoneKey} value={zoneKey} data-testid={`menu-item-${zoneKey}`}>
                    {tz.name} ({tz.gmtLabel})
                  </SelectItem>
                ))}
                {filteredZonesToAdd.length === 0 && (
                  <div className="py-2 px-4 text-sm text-muted-foreground">
                    No cities found
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm uppercase text-muted-foreground">View</span>
            <Button
              variant={layout === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setLayout("grid")}
              className="h-8 w-8 rounded-full"
              title="Grid view"
              data-testid="button-grid-view"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={layout === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setLayout("list")}
              className="h-8 w-8 rounded-full"
              title="List view"
              data-testid="button-list-view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext 
            items={selectedZones} 
            strategy={layout === "grid" ? rectSortingStrategy : verticalListSortingStrategy}
          >
            <div className={layout === "grid" ? "grid grid-cols-1 gap-8 md:grid-cols-3" : "flex flex-col gap-4"}>
              {selectedZones.map((zoneKey, index) => (
                <SortableClockItem
                  key={zoneKey}
                  id={zoneKey}
                  zoneKey={zoneKey}
                  index={index}
                  baseTime={baseTime}
                  layout={layout}
                  isNew={newlyAddedZone === zoneKey}
                  onZoneChange={handleZoneChange}
                  otherZoneKeys={getOtherZoneKeys(index)}
                  onTimeUpdate={onTimeUpdate}
                  onRemove={handleRemoveClock}
                  allZones={selectedZones}
                  isDragActive={activeId !== null}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeId && activeZone ? (
              <div className="opacity-90 shadow-xl">
                <DigitalClock
                  time={getTimeInZone(baseTime, activeZone.offset)}
                  cityName={activeZone.name}
                  timezone={activeZone.gmtLabel}
                  isSelectable={false}
                  isDraggable
                  isBeingDragged
                  layout={layout}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </section>
    </div>
  );
}
