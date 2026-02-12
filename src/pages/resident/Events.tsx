
import { useState } from "react";
import { ResidentSidebar } from "@/components/resident/ResidentSidebar";
import { Calendar as CalendarIcon, Loader2, MapPin, Clock, LayoutList, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ResidentLayout } from "@/components/resident/ResidentLayout";
import { getEvents } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatToUserTimezone } from "@/utils/date";

const ResidentEvents = () => {
    const [view, setView] = useState<'list' | 'calendar'>('list');
    const [date, setDate] = useState<Date | undefined>(new Date());

    const { data: events, isLoading } = useQuery({
        queryKey: ['events'],
        queryFn: getEvents
    });

    const filteredEvents = view === 'calendar' && date
        ? events?.filter((event: any) => {
            const eventDate = new Date(event.start_time);
            return eventDate.getDate() === date.getDate() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getFullYear() === date.getFullYear();
        })
        : events;

    // Create a set of dates that have events for the calendar modifiers
    const eventDates = events?.map((e: any) => new Date(e.start_time)) || [];

    return (
        <ResidentLayout>
            <div className="p-8">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-light tracking-tight flex items-center gap-3">
                        <CalendarIcon className="h-8 w-8" />
                        Community Calendar
                    </h1>
                    <div className="flex gap-2">
                        <Button
                            variant={view === 'list' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setView('list')}
                        >
                            <LayoutList className="h-4 w-4 mr-2" /> List
                        </Button>
                        <Button
                            variant={view === 'calendar' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setView('calendar')}
                        >
                            <CalendarIcon className="h-4 w-4 mr-2" /> Calendar
                        </Button>
                    </div>
                </header>

                <div className="grid gap-6 lg:grid-cols-4">
                    {view === 'calendar' && (
                        <div className="lg:col-span-1">
                            <div className="bg-card rounded-lg border shadow-sm p-4">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    className="rounded-md border-none w-full"
                                    modifiers={{
                                        event: eventDates
                                    }}
                                    modifiersStyles={{
                                        event: { fontWeight: 'bold', textDecoration: 'underline', color: 'var(--primary)' }
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    <div className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-3", view === 'calendar' ? "lg:col-span-3" : "lg:col-span-4")}>
                        {isLoading ? (
                            <div className="col-span-full text-center"><Loader2 className="animate-spin inline" /> Loading...</div>
                        ) : filteredEvents?.length === 0 ? (
                            <div className="col-span-full text-center text-muted-foreground p-8 border rounded-lg border-dashed">
                                {view === 'calendar' ? "No events on this date." : "No upcoming events scheduled."}
                            </div>
                        ) : (
                            filteredEvents?.map((event: any) => (
                                <Card key={event.id} className="relative overflow-hidden group hover:shadow-lg transition-all">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-xl">{event.title}</CardTitle>
                                        </div>
                                        <div className="space-y-1 mt-2">
                                            <CardDescription className="flex items-center text-sm">
                                                <Clock className="h-3 w-3 mr-2 text-primary" />
                                                {event.start_time ? formatToUserTimezone(event.start_time) : 'N/A'}
                                            </CardDescription>
                                            <CardDescription className="flex items-center text-sm">
                                                <MapPin className="h-3 w-3 mr-2 text-primary" />
                                                {event.location}
                                            </CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">{event.description}</p>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </ResidentLayout>
    );
};

export default ResidentEvents;
