
import { useState } from "react";
import Header from "@/components/admin/Header";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Loader2, CheckCircle, Search, Eye } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getIncidentReports, updateIncidentReport } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const Incidents = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIncident, setSelectedIncident] = useState<any>(null);

    const { data: incidents, isLoading } = useQuery({
        queryKey: ['incidents'],
        queryFn: getIncidentReports
    });

    const mutation = useMutation({
        mutationFn: ({ id, status }: { id: number, status: string }) => updateIncidentReport(id, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['incidents'] });
            toast({ title: "Status Updated", description: "Incident status has been updated." });
            setSelectedIncident(null);
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
        }
    });

    const handleUpdateStatus = (id: number, status: string) => {
        mutation.mutate({ id, status });
    };

    const filteredIncidents = incidents?.filter((inc: any) =>
        inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open': return <Badge variant="destructive">Open</Badge>;
            case 'investigating': return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600">Investigating</Badge>;
            case 'resolved': return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Resolved</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-background/50 p-8">
            <Header />
            <div className="relative max-w-7xl mx-auto space-y-8 mt-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-light flex items-center gap-2">
                        <ShieldAlert className="h-6 w-6" />
                        Incident Reports
                    </h2>
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search incidents..." className="pl-8" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                </div>

                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24"><Loader2 className="animate-spin inline" /> Loading...</TableCell>
                                </TableRow>
                            ) : filteredIncidents.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">No incidents found.</TableCell>
                                </TableRow>
                            ) : (
                                filteredIncidents.map((incident: any) => (
                                    <TableRow key={incident.id}>
                                        <TableCell className="font-medium">{incident.title}</TableCell>
                                        <TableCell>{incident.location}</TableCell>
                                        <TableCell>{getStatusBadge(incident.status)}</TableCell>
                                        <TableCell>{new Date(incident.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="sm" onClick={() => setSelectedIncident(incident)}>
                                                        <Eye className="h-4 w-4 mr-2" /> Details
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>{incident.title}</DialogTitle>
                                                        <DialogDescription>Reported on {new Date(incident.created_at).toLocaleString()}</DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="font-medium mb-1">Description:</h4>
                                                            <p className="text-sm text-muted-foreground">{incident.description}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium mb-1">Location:</h4>
                                                            <p className="text-sm text-muted-foreground">{incident.location || "N/A"}</p>
                                                        </div>
                                                        {incident.image && (
                                                            <div>
                                                                <h4 className="font-medium mb-1">Attachment:</h4>
                                                                <img src={incident.image} alt="Incident attachment" className="rounded-md border max-h-60 object-contain" />
                                                            </div>
                                                        )}
                                                        <div className="flex justify-end gap-2 pt-4">
                                                            {incident.status === 'open' && (
                                                                <Button onClick={() => handleUpdateStatus(incident.id, 'investigating')} variant="secondary">
                                                                    Mark as Investigating
                                                                </Button>
                                                            )}
                                                            {incident.status !== 'resolved' && (
                                                                <Button onClick={() => handleUpdateStatus(incident.id, 'resolved')}>
                                                                    Resolve Incident
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default Incidents;
