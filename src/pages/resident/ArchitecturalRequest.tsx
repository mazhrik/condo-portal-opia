import { useState } from "react";
import { ResidentLayout } from "@/components/resident/ResidentLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getArchitecturalRequests, createArchitecturalRequest } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Hammer, FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { formatToUserTimezone } from "@/utils/date";

const ArchitecturalRequest = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const { data: requests, isLoading } = useQuery({
        queryKey: ['arc-requests'],
        queryFn: () => getArchitecturalRequests()
    });

    const createMutation = useMutation({
        mutationFn: createArchitecturalRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['arc-requests'] });
            setIsOpen(false);
            setTitle("");
            setDescription("");
            setFile(null);
            toast({ title: "Request Submitted", description: "Your ARC request has been submitted for review." });
        },
        onError: (error: any) => {
            toast({ title: "Error", description: "Failed to submit request.", variant: "destructive" });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (file) {
            formData.append('attachment', file);
        }
        createMutation.mutate(formData);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved': return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>;
            case 'denied': return <Badge className="bg-red-500"><XCircle className="w-3 h-3 mr-1" /> Denied</Badge>;
            default: return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
        }
    };

    return (
        <ResidentLayout>
            <div className="p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-light tracking-tight flex items-center gap-3">
                            <Hammer className="h-8 w-8" />
                            Architectural Requests
                        </h1>
                        <p className="text-muted-foreground mt-2">Submit and track modification requests for your unit.</p>
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> New Request
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>New ARC Request</DialogTitle>
                                <DialogDescription>Describe the proposed modification. Attach plans or photos.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title / Project Name</Label>
                                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Kitchen Renovation" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="desc">Description</Label>
                                    <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Detailed description of work..." />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="file">Attachment (Plans/Photos)</Label>
                                    <Input id="file" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                                </div>
                                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                                    {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit Request"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </header>

                <div className="grid gap-4">
                    {isLoading ? (
                        <div className="text-center p-8"><Loader2 className="animate-spin inline" /> Loading...</div>
                    ) : (requests?.results?.length ?? 0) === 0 ? (
                        <div className="text-center text-muted-foreground p-12 border rounded-lg border-dashed">
                            No requests found. Submit a new request to get started.
                        </div>
                    ) : (
                        requests?.results?.map((req: any) => (
                            <Card key={req.id}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-lg font-medium">
                                        {req.title}
                                    </CardTitle>
                                    {getStatusBadge(req.status)}
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">{req.description}</p>
                                    <div className="text-xs text-muted-foreground flex gap-4">
                                        <span>Submitted: {req.submitted_at ? formatToUserTimezone(req.submitted_at) : 'N/A'}</span>
                                        {req.attachment && (
                                            <a href={req.attachment} target="_blank" rel="noreferrer" className="flex items-center hover:underline text-primary">
                                                <FileText className="w-3 h-3 mr-1" /> View Attachment
                                            </a>
                                        )}
                                    </div>
                                    {req.board_comment && (
                                        <div className="mt-4 p-3 bg-muted rounded-md text-sm">
                                            <span className="font-semibold">Board Comment:</span> {req.board_comment}
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

export default ArchitecturalRequest;
