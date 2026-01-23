
import { useState } from "react";
import { ResidentSidebar } from "@/components/resident/ResidentSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { ShieldAlert, Loader2, Plus, Image as ImageIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ResidentLayout } from "@/components/resident/ResidentLayout";
import { getIncidentReports, createIncidentReport } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const ResidentIncidents = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        image: null as File | null
    });

    const { data: incidents, isLoading } = useQuery({
        queryKey: ['incidents'],
        queryFn: getIncidentReports
    });

    const createMutation = useMutation({
        mutationFn: (data: FormData) => createIncidentReport(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['incidents'] });
            setIsDialogOpen(false);
            setFormData({ title: "", description: "", location: "", image: null });
            toast({ title: "Report Submitted", description: "Your incident report has been submitted." });
        },
        onError: (error: any) => {
            toast({ title: "Error", description: error.response?.data?.detail || "Failed to submit report.", variant: "destructive" });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("location", formData.location);
        if (formData.image) {
            data.append("image", formData.image);
        }
        // Resident ID is inferred from token by backend
        createMutation.mutate(data);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open': return <Badge variant="destructive">Open</Badge>;
            case 'investigating': return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600">Investigating</Badge>;
            case 'resolved': return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Resolved</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <ResidentLayout>
            <div className="p-8">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-light tracking-tight flex items-center gap-3">
                        <ShieldAlert className="h-8 w-8" />
                        Incident Reporting
                    </h1>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" /> Report Incident
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Report an Incident</DialogTitle>
                                <DialogDescription>Please provide details about the incident.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        placeholder="e.g. Broken Lock"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="e.g. Main Entrance"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        required
                                        placeholder="Describe what happened..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="image">Attachment (Optional)</Label>
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                                    />
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={createMutation.isPending}>
                                        {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Submit Report
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </header>

                <div className="grid gap-6">
                    {isLoading ? (
                        <div className="text-center"><Loader2 className="animate-spin inline" /> Loading...</div>
                    ) : incidents?.length === 0 ? (
                        <div className="text-center text-muted-foreground p-8 border rounded-lg border-dashed">
                            No incidents reported yet.
                        </div>
                    ) : (
                        incidents?.map((incident: any) => (
                            <Card key={incident.id} className="relative overflow-hidden">
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${incident.status === 'open' ? 'bg-red-500' : incident.status === 'resolved' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                <CardHeader className="pl-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle>{incident.title}</CardTitle>
                                            <CardDescription>{new Date(incident.created_at).toLocaleDateString()} • {incident.location}</CardDescription>
                                        </div>
                                        {getStatusBadge(incident.status)}
                                    </div>
                                </CardHeader>
                                <CardContent className="pl-6">
                                    <p className="text-sm">{incident.description}</p>
                                    {incident.image && (
                                        <div className="mt-4">
                                            <Button variant="outline" size="sm" className="h-auto py-1" onClick={() => window.open(incident.image, '_blank')}>
                                                <ImageIcon className="h-3 w-3 mr-2" /> View Attachment
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </ResidentLayout>
    );
};

export default ResidentIncidents;
