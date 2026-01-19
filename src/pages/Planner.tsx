import { useState } from "react";
import { Plus, Sprout } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CropCalendar from "@/components/planner/CropCalendar";
import EventDialog from "@/components/planner/EventDialog";
import UpcomingEvents from "@/components/planner/UpcomingEvents";
import { CropEvent, eventTypeConfig } from "@/types/crop-events";
import { useToast } from "@/hooks/use-toast";

// Sample initial events
const initialEvents: CropEvent[] = [
  {
    id: "1",
    title: "Plant Tomatoes",
    cropName: "Tomatoes",
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    type: "planting",
    notes: "Start with seedlings in the greenhouse",
    reminder: true,
  },
  {
    id: "2",
    title: "Water Corn Field",
    cropName: "Corn",
    date: new Date(new Date().setDate(new Date().getDate() + 3)),
    type: "watering",
    reminder: true,
  },
  {
    id: "3",
    title: "Harvest Wheat",
    cropName: "Wheat",
    date: new Date(new Date().setDate(new Date().getDate() + 5)),
    type: "harvest",
    notes: "Eastern field section ready for harvest",
    reminder: true,
  },
];

const Planner = () => {
  const [events, setEvents] = useState<CropEvent[]>(initialEvents);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [editingEvent, setEditingEvent] = useState<CropEvent>();
  const { toast } = useToast();

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setEditingEvent(undefined);
    setDialogOpen(true);
  };

  const handleEventClick = (event: CropEvent) => {
    setEditingEvent(event);
    setSelectedDate(undefined);
    setDialogOpen(true);
  };

  const handleSave = (eventData: Omit<CropEvent, "id" | "title">) => {
    if (editingEvent) {
      // Update existing event
      setEvents((prev) =>
        prev.map((e) =>
          e.id === editingEvent.id
            ? {
                ...e,
                ...eventData,
                title: `${eventTypeConfig[eventData.type].label} ${eventData.cropName}`,
              }
            : e
        )
      );
      toast({
        title: "Event Updated",
        description: `${eventData.cropName} ${eventTypeConfig[eventData.type].label.toLowerCase()} has been updated.`,
      });
    } else {
      // Create new event
      const newEvent: CropEvent = {
        id: Date.now().toString(),
        title: `${eventTypeConfig[eventData.type].label} ${eventData.cropName}`,
        ...eventData,
      };
      setEvents((prev) => [...prev, newEvent]);
      toast({
        title: "Event Scheduled",
        description: `${eventData.cropName} ${eventTypeConfig[eventData.type].label.toLowerCase()} scheduled${eventData.reminder ? " with reminder" : ""}.`,
      });
    }
    setEditingEvent(undefined);
    setSelectedDate(undefined);
  };

  const handleDelete = () => {
    if (editingEvent) {
      setEvents((prev) => prev.filter((e) => e.id !== editingEvent.id));
      toast({
        title: "Event Deleted",
        description: "The event has been removed from your calendar.",
        variant: "destructive",
      });
      setDialogOpen(false);
      setEditingEvent(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Sprout className="h-8 w-8 text-primary" />
            <span className="font-display text-2xl font-bold text-foreground">
              GreenField
            </span>
          </Link>
          
          <Button onClick={() => { setSelectedDate(new Date()); setEditingEvent(undefined); setDialogOpen(true); }}>
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Crop Planning Calendar
          </h1>
          <p className="text-muted-foreground">
            Schedule planting, watering, and harvest dates. Set reminders to stay on track.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <CropCalendar
              events={events}
              onDateClick={handleDateClick}
              onEventClick={handleEventClick}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <UpcomingEvents events={events} onEventClick={handleEventClick} />
            
            {/* Legend */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                Event Types
              </h3>
              <div className="space-y-3">
                {(Object.entries(eventTypeConfig) as [string, { label: string; bgColor: string; color: string }][]).map(
                  ([key, config]) => (
                    <div key={key} className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded ${config.bgColor}`} />
                      <span className="text-sm text-foreground">{config.label}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Event Dialog */}
      <EventDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        onDelete={editingEvent ? handleDelete : undefined}
        initialData={editingEvent}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default Planner;
