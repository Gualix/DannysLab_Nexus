import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { minBookingDate, formatDateISO } from "@/lib/date";
import { format } from "date-fns";

interface Props {
  value?: string;
  onChange: (iso: string) => void;
}

export function T15DatePicker({ value, onChange }: Props) {
  const min = minBookingDate();
  const selected = value ? new Date(value + "T00:00:00") : undefined;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start gap-2 rounded-xl"
        >
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          {selected ? format(selected, "PPP") : <span className="text-muted-foreground">Pick a date (min {format(min, "PPP")})</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(d) => d && onChange(formatDateISO(d))}
          disabled={(d) => d < min}
          initialFocus
        />
        <div className="px-3 py-2 text-xs text-muted-foreground border-t">
          Minimum date: {format(min, "PPP")} (T-15 policy)
        </div>
      </PopoverContent>
    </Popover>
  );
}
