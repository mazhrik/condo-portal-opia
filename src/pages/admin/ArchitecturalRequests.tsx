import { useState } from "react";
import Header from "@/components/admin/Header";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getArchitecturalRequests, updateArchitecturalRequestStatus } from "@/utils/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatToUserTimezone } from "@/utils/date";

const AdminArchitecturalRequests = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [comment, setComment] = useState("");

    const { data: requests, isLoading } = useQuery({
        queryKey: ['arc-requests'],
        queryFn: getArchitecturalRequests
    });

    const updateMutation = useMutation({
        mutationFn: updateArchitecturalRequestStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['arc-requests'] });
            toast({ title: "Success", description: "Request updated successfully." });
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to update request.", variant: "destructive" });
        }
    });

    const handleUpdate = (id: number, status: string, board_comment: string) => {
        updateMutation.mutate({ id, status, board_comment });
    };
    
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved': return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>;
            case 'denied': return <Badge className="bg-red-500"><XCircle className="w-3 h-3 mr-1" /> Denied</Badge>;
            case 'pending':
            default: return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
        }
    };

    return (
        <div className="p-8">
            <Header />
            <main className="mt-8">
                <h1 className="text-2xl font-bold mb-4">Architectural Requests</h1>
                {isLoading ? (
                    <div className="text-center"><Loader2 className="animate-spin inline" /> Loading...</div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Resident</TableHead>
                                <TableHead>Request</TableHead>
                                <TableHead>Submitted</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests?.results?.map((req: any) => (
                                <TableRow key={req.id}>
                                    <TableCell>{req.resident_name}</TableCell>
                                    <TableCell>
                                        <p className="font-bold">{req.title}</p>
                                        <p className="text-sm text-muted-foreground">{req.description}</p>
                                        {req.attachment && (
                                            <a href={req.attachment} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline flex items-center mt-2">
                                                <FileText className="w-4 h-4 mr-1" /> View Attachment
                                            </a>
                                        )}
                                    </TableCell>
                                    <TableCell>{formatToUserTimezone(req.submitted_at)}</TableCell>
                                    <TableCell>{getStatusBadge(req.status)}</TableCell>
                                    <TableCell className="space-y-2">
                                        <Select onValueChange={(value) => handleUpdate(req.id, value, comment)} defaultValue={req.status}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="approved">Approve</SelectItem>
                                                <SelectItem value="denied">Deny</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Textarea placeholder="Add a comment..." onChange={(e) => setComment(e.target.value)} />
                                        <Button size="sm" onClick={() => handleUpdate(req.id, req.status, comment)} disabled={updateMutation.isPending}>
                                            Save Comment
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </main>
        </div>
    );
};

export default AdminArchitecturalRequests;
