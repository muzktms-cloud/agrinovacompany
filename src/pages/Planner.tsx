import { useState, useEffect } from "react";
import { Plus, Sprout, Bell, CloudSun } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CropCalendar from "@/components/planner/CropCalendar";
import EventDialog from "@/components/planner/EventDialog";
import UpcomingEvents from "@/components/planner/UpcomingEvents";
import { CropEvent, eventTypeConfig } from "@/types/crop-events";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Planner = () => {
  const [events, setEvents] = useState<CropEvent[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [editingEvent, setEditingEvent] = useState<CropEvent>();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [weatherTip, setWeatherTip] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch events from database
  useEffect(() => {
    fetchEvents();
    fetchNotifications();
    fetchWeatherTip();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('crop_events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;

      const mappedEvents: CropEvent[] = (data || []).map((e) => ({
        id: e.id,
        title: `${eventTypeConfig[e.event_type as keyof typeof eventTypeConfig]?.label || e.event_type} ${e.crop}`,
        cropName: e.crop,
        date: new Date(e.date),
        type: e.event_type as CropEvent['type'],
        notes: e.notes || undefined,
        reminder: e.reminder || false,
      }));
      setEvents(mappedEvents);
    } catch (error: any) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('is_read', false)
        .order('notify_at', { ascending: true })
        .limit(5);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchWeatherTip = async () => {
    try {
      // Get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { data, error } = await supabase.functions.invoke('weather-advisor', {
            body: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              location: 'Your location'
            }
          });

          if (!error && data?.advice?.farmingTips?.[0]) {
            setWeatherTip(data.advice.farmingTips[0]);
          }
        }, () => {
          // Fallback - no location access
          setWeatherTip("Check the Weather Advisor for today's farming recommendations!");
        });
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

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

  const handleSave = async (eventData: Omit<CropEvent, "id" | "title">) => {
    try {
      if (editingEvent) {
        // Update existing event
        const { error } = await supabase
          .from('crop_events')
          .update({
            crop: eventData.cropName,
            event_type: eventData.type,
            date: eventData.date.toISOString().split('T')[0],
            notes: eventData.notes || null,
            reminder: eventData.reminder,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingEvent.id);

        if (error) throw error;

        toast({
          title: "Event Updated",
          description: `${eventData.cropName} ${eventTypeConfig[eventData.type].label.toLowerCase()} has been updated.`,
        });
      } else {
        // Create new event
        const { data, error } = await supabase
          .from('crop_events')
          .insert({
            crop: eventData.cropName,
            event_type: eventData.type,
            date: eventData.date.toISOString().split('T')[0],
            notes: eventData.notes || null,
            reminder: eventData.reminder,
          })
          .select()
          .single();

        if (error) throw error;

        // Create notification if reminder is enabled
        if (eventData.reminder && data) {
          const notifyDate = new Date(eventData.date);
          notifyDate.setDate(notifyDate.getDate() - 1);
          notifyDate.setHours(9, 0, 0, 0);

          await supabase.from('notifications').insert({
            event_id: data.id,
            title: `Reminder: ${eventTypeConfig[eventData.type].label} ${eventData.cropName}`,
            message: `Don't forget: ${eventTypeConfig[eventData.type].label} ${eventData.cropName} is scheduled for tomorrow.`,
            notify_at: notifyDate.toISOString(),
          });
        }

        toast({
          title: "Event Scheduled",
          description: `${eventData.cropName} ${eventTypeConfig[eventData.type].label.toLowerCase()} scheduled${eventData.reminder ? " with reminder" : ""}.`,
        });
      }

      fetchEvents();
      setEditingEvent(undefined);
      setSelectedDate(undefined);
    } catch (error: any) {
      console.error('Error saving event:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save event",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (editingEvent) {
      try {
        const { error } = await supabase
          .from('crop_events')
          .delete()
          .eq('id', editingEvent.id);

        if (error) throw error;

        toast({
          title: "Event Deleted",
          description: "The event has been removed from your calendar.",
          variant: "destructive",
        });

        fetchEvents();
        setDialogOpen(false);
        setEditingEvent(undefined);
      } catch (error: any) {
        console.error('Error deleting event:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to delete event",
          variant: "destructive",
        });
      }
    }
  };

  const markNotificationRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    fetchNotifications();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Sprout className="h-8 w-8 text-primary" />
            <span className="font-display text-2xl font-bold text-foreground">
              AgriNova
            </span>
          </Link>
          
          <div className="flex items-center gap-3">
            {notifications.length > 0 && (
              <div className="relative">
                <Bell className="h-5 w-5 text-primary" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {notifications.length}
                </Badge>
              </div>
            )}
            <Button onClick={() => { setSelectedDate(new Date()); setEditingEvent(undefined); setDialogOpen(true); }}>
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          </div>
        </div>
      </header>

      {/* Weather Tip Banner */}
      {weatherTip && (
        <div className="bg-primary/10 border-b border-primary/20">
          <div className="container mx-auto px-6 py-3 flex items-center gap-3">
            <CloudSun className="h-5 w-5 text-primary flex-shrink-0" />
            <p className="text-sm text-foreground">
              <span className="font-semibold">Today's Tip:</span> {weatherTip}
            </p>
            <Link to="/weather" className="text-sm text-primary hover:underline ml-auto flex-shrink-0">
              View Full Forecast →
            </Link>
          </div>
        </div>
      )}

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

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="mb-6 space-y-2">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{n.title}</p>
                    <p className="text-sm text-muted-foreground">{n.message}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => markNotificationRead(n.id)}
                >
                  Dismiss
                </Button>
              </div>
            ))}
          </div>
        )}

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
