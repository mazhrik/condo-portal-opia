
import { ResidentSidebar } from "@/components/resident/ResidentSidebar";
import { Calendar as CalendarIcon, Loader2, MapPin, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ResidentLayout } from "@/components/resident/ResidentLayout";
import { getEvents } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const ResidentEvents = () => {
    const { data: events, isLoading } = useQuery({
        queryKey: ['events'],
        queryFn: getEvents
    });

    return (
        <ResidentLayout>
            <div className="p-8">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-light tracking-tight flex items-center gap-3">
                        <CalendarIcon className="h-8 w-8" />
                        Community Calendar
                    </h1>
                </header>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {isLoading ? (
                        <div className="col-span-3 text-center"><Loader2 className="animate-spin inline" /> Loading...</div>
                    ) : events?.length === 0 ? (
                        <div className="col-span-3 text-center text-muted-foreground p-8 border rounded-lg border-dashed">
                            No upcoming events scheduled.
                        </div>
                    ) : (
                        events?.map((event: any) => (
                            <Card key={event.id} className="relative overflow-hidden group hover:shadow-lg transition-all">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-xl">{event.title}</CardTitle>
                                    </div>
                                    <div className="space-y-1 mt-2">
                                        <CardDescription className="flex items-center text-sm">
                                            <Clock className="h-3 w-3 mr-2 text-primary" />
                                            {new Date(event.start_time).toLocaleString()}
                                        </CardDescription>
                                        <CardDescription className="flex items-center text-sm">
                                            <MapPin className="h-3 w-3 mr-2 text-primary" />
                                            {event.location}
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-foreground/80 leading-relaxed">{event.description}</p>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </ResidentLayout>
    );
};

export default ResidentEvents;
