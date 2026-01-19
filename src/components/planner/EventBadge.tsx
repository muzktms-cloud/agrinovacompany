import { Sprout, Droplets, Wheat, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { CropEvent, eventTypeConfig } from "@/types/crop-events";

interface EventBadgeProps {
  event: CropEvent;
  compact?: boolean;
  onClick?: () => void;
}

const eventTypeIcons = {
  planting: Sprout,
  watering: Droplets,
  harvest: Wheat,
};

const EventBadge = ({ event, compact = false, onClick }: EventBadgeProps) => {
  const Icon = eventTypeIcons[event.type];
  const config = eventTypeConfig[event.type];

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "w-full text-left px-2 py-1 rounded-md text-xs font-medium truncate flex items-center gap-1 transition-all hover:scale-105",
          config.bgColor,
          config.color
        )}
      >
        <Icon className="h-3 w-3 flex-shrink-0" />
        <span className="truncate">{event.cropName}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-3 rounded-lg border transition-all hover:shadow-md hover:-translate-y-0.5",
        config.bgColor,
        "border-border/50"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon className={cn("h-4 w-4 flex-shrink-0", config.color)} />
          <span className={cn("font-medium text-sm", config.color)}>
            {event.cropName}
          </span>
        </div>
        {event.reminder && (
          <Bell className="h-3 w-3 text-muted-foreground flex-shrink-0" />
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-1 capitalize">
        {config.label}
      </p>
      {event.notes && (
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {event.notes}
        </p>
      )}
    </button>
  );
};

export default EventBadge;
