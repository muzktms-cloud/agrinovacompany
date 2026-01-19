export type EventType = "planting" | "watering" | "harvest";

export interface CropEvent {
  id: string;
  title: string;
  date: Date;
  type: EventType;
  cropName: string;
  notes?: string;
  reminder: boolean;
}

export const eventTypeConfig: Record<EventType, { label: string; color: string; bgColor: string }> = {
  planting: { 
    label: "Planting", 
    color: "text-primary",
    bgColor: "bg-sage-light"
  },
  watering: { 
    label: "Watering", 
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  harvest: { 
    label: "Harvest", 
    color: "text-accent-foreground",
    bgColor: "bg-accent/20"
  },
};
