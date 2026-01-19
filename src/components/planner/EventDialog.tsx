import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, Bell, Sprout, Droplets, Wheat } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CropEvent, EventType, eventTypeConfig } from "@/types/crop-events";

const eventSchema = z.object({
  cropName: z.string().trim().min(1, "Crop name is required").max(100, "Crop name must be less than 100 characters"),
  type: z.enum(["planting", "watering", "harvest"]),
  date: z.date({ required_error: "Date is required" }),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
  reminder: z.boolean(),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (event: Omit<CropEvent, "id" | "title">) => void;
  onDelete?: () => void;
  initialData?: CropEvent;
  selectedDate?: Date;
}

const eventTypeIcons = {
  planting: Sprout,
  watering: Droplets,
  harvest: Wheat,
};

const EventDialog = ({ 
  open, 
  onOpenChange, 
  onSave, 
  onDelete,
  initialData,
  selectedDate 
}: EventDialogProps) => {
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      cropName: "",
      type: "planting",
      date: selectedDate || new Date(),
      notes: "",
      reminder: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          cropName: initialData.cropName,
          type: initialData.type,
          date: new Date(initialData.date),
          notes: initialData.notes || "",
          reminder: initialData.reminder,
        });
      } else {
        form.reset({
          cropName: "",
          type: "planting",
          date: selectedDate || new Date(),
          notes: "",
          reminder: true,
        });
      }
    }
  }, [open, initialData, selectedDate, form]);

  const onSubmit = (data: EventFormData) => {
    onSave({
      cropName: data.cropName,
      type: data.type,
      date: data.date,
      notes: data.notes,
      reminder: data.reminder,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {initialData ? "Edit Event" : "Schedule Crop Event"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cropName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crop Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Tomatoes, Corn, Wheat..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(Object.keys(eventTypeConfig) as EventType[]).map((type) => {
                        const Icon = eventTypeIcons[type];
                        return (
                          <SelectItem key={type} value={type}>
                            <div className="flex items-center gap-2">
                              <Icon className={cn("h-4 w-4", eventTypeConfig[type].color)} />
                              {eventTypeConfig[type].label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any additional notes..." 
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reminder"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <FormLabel className="text-base cursor-pointer">Enable Reminder</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Get notified before this event
                      </p>
                    </div>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              {initialData && onDelete && (
                <Button type="button" variant="destructive" onClick={onDelete}>
                  Delete
                </Button>
              )}
              <Button type="submit" className="flex-1">
                {initialData ? "Save Changes" : "Schedule Event"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
