import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { Card } from "@/components/ui/card";

interface HeroClockProps {
  city: string;
  timezone: string;
  gmtOffset: string;
}

export function HeroClock({ city, timezone, gmtOffset }: HeroClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const zonedTime = toZonedTime(time, timezone);
  const formattedTime = format(zonedTime, "HH:mm:ss");
  const formattedDate = format(zonedTime, "EEEE, MMMM d, yyyy");

  return (
    <Card className="p-8 md:p-12 text-center" data-testid="card-hero-clock">
      <h2 
        className="text-2xl md:text-3xl font-semibold text-foreground mb-2"
        data-testid="text-hero-city"
      >
        {city}
      </h2>
      <div 
        className="font-mono text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-foreground mb-4"
        data-testid="text-hero-time"
      >
        {formattedTime}
      </div>
      <p 
        className="text-lg md:text-xl text-muted-foreground mb-2"
        data-testid="text-hero-date"
      >
        {formattedDate}
      </p>
      <p 
        className="text-sm md:text-base text-muted-foreground"
        data-testid="text-hero-offset"
      >
        {gmtOffset}
      </p>
    </Card>
  );
}
