import { format, isAfter, isBefore, addDays } from "date-fns";
import { CalendarDays } from "lucide-react";
import { CropEvent } from "@/types/crop-events";
import EventBadge from "./EventBadge";

interface UpcomingEventsProps {
  events: CropEvent[];
  onEventClick: (event: CropEvent) => void;
}

const UpcomingEvents = ({ events, onEventClick }: UpcomingEventsProps) => {
  const today = new Date();
  const nextWeek = addDays(today, 7);

  const upcomingEvents = events
    .filter((event) => {
      const eventDate = new Date(event.date);
      return isAfter(eventDate, today) && isBefore(eventDate, nextWeek);
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="h-5 w-5 text-primary" />
        <h3 className="font-display text-lg font-semibold text-foreground">
          Upcoming This Week
        </h3>
      </div>

      {upcomingEvents.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground text-sm">
            No upcoming events this week
          </p>
          <p className="text-muted-foreground/70 text-xs mt-1">
            Click on a date to schedule something
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">
                {format(new Date(event.date), "EEEE, MMM d")}
              </p>
              <EventBadge event={event} onClick={() => onEventClick(event)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents;
