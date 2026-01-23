
import { useState } from "react";
import Header from "@/components/admin/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, Loader2, Plus, MapPin, Clock } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEvents, createEvent } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Events = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        start_time: "",
        end_time: "",
        location: ""
    });

    const { data: events, isLoading } = useQuery({
        queryKey: ['events'],
        queryFn: getEvents
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => createEvent({
            ...data,
            created_by: 1 // Need staff ID logic or backend handles it
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            setIsDialogOpen(false);
            setFormData({ title: "", description: "", start_time: "", end_time: "", location: "" });
            toast({ title: "Event Created", description: "New event has been added to the calendar." });
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to create event.", variant: "destructive" });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-background/50 p-8">
            <Header />
            <div className="relative max-w-7xl mx-auto space-y-8 mt-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-light flex items-center gap-2">
                        <CalendarIcon className="h-6 w-6" />
                        Community Events
                    </h2>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" /> Create Event
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Event</DialogTitle>
                                <DialogDescription>Organize a community event.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Event Title</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        placeholder="e.g. Summer BBQ"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="start_time">Start Time</Label>
                                        <Input
                                            id="start_time"
                                            type="datetime-local"
                                            value={formData.start_time}
                                            onChange={e => setFormData({ ...formData, start_time: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="end_time">End Time</Label>
                                        <Input
                                            id="end_time"
                                            type="datetime-local"
                                            value={formData.end_time}
                                            onChange={e => setFormData({ ...formData, end_time: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="e.g. Roof Top Terrace"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description (Optional)</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Details about the event..."
                                    />
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={createMutation.isPending}>
                                        {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Event
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {isLoading ? (
                        <div className="col-span-3 text-center"><Loader2 className="animate-spin inline" /> Loading...</div>
                    ) : events?.length === 0 ? (
                        <div className="col-span-3 text-center text-muted-foreground">No upcoming events.</div>
                    ) : (
                        events?.map((event: any) => (
                            <Card key={event.id} className="glass border-white/20">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-xl">{event.title}</CardTitle>
                                    </div>
                                    <CardDescription className="flex items-center mt-2">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {new Date(event.start_time).toLocaleString()}
                                    </CardDescription>
                                    <CardDescription className="flex items-center">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        {event.location}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-foreground/80">{event.description}</p>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Events;
