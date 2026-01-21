import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Timezone } from "@shared/schema";

interface ClockTileProps {
  timezone: Timezone;
  onRemove: (id: string) => void;
  onView: (timezone: Timezone) => void;
  isSelected: boolean;
}

export function ClockTile({ timezone, onRemove, onView, isSelected }: ClockTileProps) {
  const [time, setTime] = useState(new Date());
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: timezone.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const zonedTime = toZonedTime(time, timezone.timezone);
  const formattedTime = format(zonedTime, "HH:mm");
  const formattedSeconds = format(zonedTime, "ss");

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`
        group relative p-4 transition-all duration-200
        ${isDragging ? "opacity-50 scale-105 z-50" : ""}
        ${isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}
      `}
      data-testid={`card-clock-tile-${timezone.id}`}
    >
      <div className="absolute top-2 right-2 flex gap-1 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onView(timezone)}
          data-testid={`button-view-${timezone.id}`}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(timezone.id)}
          data-testid={`button-remove-${timezone.id}`}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-start gap-3">
        <Button
          variant="ghost"
          size="icon"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none"
          data-testid={`button-drag-${timezone.id}`}
        >
          <GripVertical className="h-5 w-5" />
        </Button>
        
        <div className="flex-1 min-w-0">
          <h3 
            className="font-semibold text-lg text-foreground truncate"
            data-testid={`text-city-${timezone.id}`}
          >
            {timezone.city}
          </h3>
          <div className="flex items-baseline gap-1 mt-1">
            <span 
              className="font-mono text-3xl md:text-4xl font-bold tracking-tight text-foreground"
              data-testid={`text-time-${timezone.id}`}
            >
              {formattedTime}
            </span>
            <span 
              className="font-mono text-lg text-muted-foreground"
              data-testid={`text-seconds-${timezone.id}`}
            >
              :{formattedSeconds}
            </span>
          </div>
          <p 
            className="text-sm text-muted-foreground mt-1"
            data-testid={`text-offset-${timezone.id}`}
          >
            {timezone.gmtOffset}
          </p>
        </div>
      </div>
    </Card>
  );
}
