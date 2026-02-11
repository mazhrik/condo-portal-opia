import { useState } from "react";
import { BoardLayout } from "@/components/board/BoardLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getArchitecturalRequests, updateArchitecturalRequestStatus } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, FileText, Hammer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const ArchitecturalReview = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [selectedReq, setSelectedReq] = useState<any>(null);
    const [comment, setComment] = useState("");
    const [action, setAction] = useState<'approved' | 'denied' | null>(null);

    const { data: requests, isLoading } = useQuery({
        queryKey: ['arc-requests-board'],
        queryFn: () => getArchitecturalRequests() // Fetch all for board
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, status, comment }: { id: number, status: string, comment: string }) =>
            updateArchitecturalRequestStatus(id, status, comment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['arc-requests-board'] });
            setSelectedReq(null);
            setComment("");
            setAction(null);
            toast({ title: "Status Updated", description: "Request status has been updated." });
        }
    });

    const handleAction = () => {
        if (!selectedReq || !action) return;
        updateMutation.mutate({
            id: selectedReq.id,
            status: action,
            comment
        });
    };

    const reqList = requests?.results || [];
    const pendingRequests = reqList.filter((r: any) => r.status === 'pending');
    const historyRequests = reqList.filter((r: any) => r.status !== 'pending');

    return (
        <BoardLayout>
            <div className="p-8">
                <h1 className="text-3xl font-light tracking-tight mb-8">Architectural Review Committee</h1>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Hammer className="w-5 h-5" /> Pending Reviews</h2>
                        {isLoading ? <Loader2 className="animate-spin" /> : pendingRequests.length === 0 ? (
                            <p className="text-muted-foreground">No pending requests.</p>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {pendingRequests.map((req: any) => (
                                    <Card key={req.id}>
                                        <CardHeader>
                                            <CardTitle className="text-lg">{req.title}</CardTitle>
                                            <CardDescription>Unit {req.resident?.unit_number} - {req.submitted_at ? new Date(req.submitted_at).toLocaleDateString() : 'N/A'}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm mb-4 line-clamp-3">{req.description}</p>
                                            {req.attachment && (
                                                <a href={req.attachment} target="_blank" rel="noreferrer" className="text-xs text-primary underline flex items-center mb-4">
                                                    <FileText className="w-3 h-3 mr-1" /> View Attachment
                                                </a>
                                            )}
                                        </CardContent>
                                        <CardFooter className="justify-end gap-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm" onClick={() => { setSelectedReq(req); setAction('denied'); }}>Deny</Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader><DialogTitle>Deny Request</DialogTitle></DialogHeader>
                                                    <Textarea placeholder="Reason for denial..." value={comment} onChange={(e) => setComment(e.target.value)} />
                                                    <DialogFooter><Button onClick={handleAction} disabled={updateMutation.isPending}>Confirm Denial</Button></DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button size="sm" onClick={() => { setSelectedReq(req); setAction('approved'); }}>Approve</Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader><DialogTitle>Approve Request</DialogTitle></DialogHeader>
                                                    <Textarea placeholder="Comments (optional)..." value={comment} onChange={(e) => setComment(e.target.value)} />
                                                    <DialogFooter><Button onClick={handleAction} disabled={updateMutation.isPending}>Confirm Approval</Button></DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 text-muted-foreground">History</h2>
                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="p-3 text-left">Date</th>
                                        <th className="p-3 text-left">Unit</th>
                                        <th className="p-3 text-left">Project</th>
                                        <th className="p-3 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historyRequests.map((req: any) => (
                                        <tr key={req.id} className="border-t">
                                            <td className="p-3">{req.submitted_at ? new Date(req.submitted_at).toLocaleDateString() : 'N/A'}</td>
                                            <td className="p-3">{req.resident?.unit_number}</td>
                                            <td className="p-3">{req.title}</td>
                                            <td className="p-3">
                                                <Badge variant={req.status === 'approved' ? 'default' : 'destructive'}>
                                                    {req.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
        </BoardLayout>
    );
};

export default ArchitecturalReview;
