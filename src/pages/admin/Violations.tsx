import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getViolations, createViolation, getResidents } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Ban, Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const Violations = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);

    // Form State
    const [residentId, setResidentId] = useState("");
    const [ruleCitation, setRuleCitation] = useState("");
    const [description, setDescription] = useState("");
    const [fineAmount, setFineAmount] = useState("0");
    const [photo, setPhoto] = useState<File | null>(null);

    const { data: violations, isLoading } = useQuery({
        queryKey: ['violations'],
        queryFn: () => getViolations()
    });

    const { data: residents } = useQuery({
        queryKey: ['residents'],
        queryFn: getResidents
    });

    const createMutation = useMutation({
        mutationFn: createViolation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['violations'] });
            setIsOpen(false);
            setResidentId("");
            setRuleCitation("");
            setDescription("");
            setFineAmount("0");
            setPhoto(null);
            toast({ title: "Violation Logged", description: "Violation has been recorded." });
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to log violation.", variant: "destructive" });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('resident', residentId);
        formData.append('rule_citation', ruleCitation);
        formData.append('description', description);
        formData.append('fine_amount', fineAmount);
        formData.append('status', 'open'); // Default status
        if (photo) {
            formData.append('photo', photo);
        }
        createMutation.mutate(formData);
    };

    return (
        <AdminLayout>
            <div className="p-8">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-light tracking-tight flex items-center gap-3">
                        <Ban className="h-8 w-8 text-destructive" />
                        Violation Tracking
                    </h1>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Log Violation
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Log New Violation</DialogTitle>
                                <DialogDescription>Record a rule violation for a resident.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label>Resident</Label>
                                    <Select value={residentId} onValueChange={setResidentId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Resident" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {residents?.results?.map((r: any) => (
                                                <SelectItem key={r.id} value={r.id.toString()}>
                                                    Unit {r.unit_number} - {r.user.first_name} {r.user.last_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Rule Citation</Label>
                                    <Input value={ruleCitation} onChange={(e) => setRuleCitation(e.target.value)} placeholder="e.g. Rule 4.2 Noise" required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Details of the incident..." required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Fine Amount ($)</Label>
                                    <Input type="number" min="0" step="0.01" value={fineAmount} onChange={(e) => setFineAmount(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Proof Photo</Label>
                                    <Input type="file" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
                                </div>
                                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                                    {createMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : "Log Violation"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </header>

                <div className="bg-card rounded-md border">
                    <div className="p-4 border-b flex items-center gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search violations..." className="pl-8" />
                        </div>
                    </div>
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="p-4 text-left font-medium text-muted-foreground">Date</th>
                                <th className="p-4 text-left font-medium text-muted-foreground">Unit</th>
                                <th className="p-4 text-left font-medium text-muted-foreground">Violation</th>
                                <th className="p-4 text-left font-medium text-muted-foreground">Fine</th>
                                <th className="p-4 text-left font-medium text-muted-foreground">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={6} className="p-8 text-center">Loading...</td></tr>
                            ) : (violations?.results?.length ?? 0) === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No violations recorded.</td></tr>
                            ) : (
                                violations?.results?.map((v: any) => (
                                    <tr key={v.id} className="border-t hover:bg-muted/50">
                                        <td className="p-4">{new Date(v.created_at).toLocaleDateString()}</td>
                                        <td className="p-4">{v.resident?.unit_number}</td>
                                        <td className="p-4 font-medium">{v.rule_citation}</td>
                                        <td className="p-4">${v.fine_amount}</td>
                                        <td className="p-4">
                                            <Badge variant={v.status === 'open' ? 'destructive' : 'outline'}>{v.status}</Badge>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button variant="ghost" size="sm">Details</Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Violations;
