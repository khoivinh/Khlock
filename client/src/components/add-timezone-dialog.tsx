import { useState, useMemo } from "react";
import { Plus, Search, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AVAILABLE_TIMEZONES } from "@shared/schema";

interface AddTimezoneDialogProps {
  onAdd: (city: string, timezone: string, gmtOffset: string) => void;
  existingCities: string[];
}

export function AddTimezoneDialog({ onAdd, existingCities }: AddTimezoneDialogProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredTimezones = useMemo(() => {
    const searchLower = search.toLowerCase();
    return AVAILABLE_TIMEZONES.filter(
      (tz) =>
        tz.city.toLowerCase().includes(searchLower) ||
        tz.timezone.toLowerCase().includes(searchLower)
    );
  }, [search]);

  const handleSelect = (city: string, timezone: string, gmtOffset: string) => {
    onAdd(city, timezone, gmtOffset);
    setSearch("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-add-timezone">
          <Plus className="h-4 w-4 mr-2" />
          Add Time Zone
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" data-testid="dialog-add-timezone">
        <DialogHeader>
          <DialogTitle>Add Time Zone</DialogTitle>
        </DialogHeader>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search-timezone"
          />
        </div>
        <ScrollArea className="h-[300px] mt-4">
          <div className="space-y-1">
            {filteredTimezones.map((tz) => {
              const isAdded = existingCities.includes(tz.city);
              return (
                <button
                  key={tz.city}
                  onClick={() => !isAdded && handleSelect(tz.city, tz.timezone, tz.gmtOffset)}
                  disabled={isAdded}
                  className={`
                    w-full flex items-center justify-between p-3 rounded-md text-left
                    transition-colors
                    ${isAdded 
                      ? "bg-muted text-muted-foreground cursor-not-allowed" 
                      : "hover-elevate active-elevate-2"
                    }
                  `}
                  data-testid={`button-timezone-${tz.city.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div>
                    <p className="font-medium">{tz.city}</p>
                    <p className="text-sm text-muted-foreground">{tz.gmtOffset}</p>
                  </div>
                  {isAdded && <Check className="h-4 w-4 text-primary" />}
                </button>
              );
            })}
            {filteredTimezones.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No cities found
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
