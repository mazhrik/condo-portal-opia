import { useState, useMemo } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getViolations, createViolation, getResidents, updateViolationStatus } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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

interface Violation {
    id: number;
    resident: { unit_number: string };
    rule_citation: string;
    description: string;
    fine_amount: string;
    photo: string;
    status: string;
}

const Violations = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Form State
    const [residentId, setResidentId] = useState("");
    const [ruleCitation, setRuleCitation] = useState("");
    const [description, setDescription] = useState("");
    const [fineAmount, setFineAmount] = useState("0");
    const [photo, setPhoto] = useState<File | null>(null);

    const { data: violations, isLoading } = useQuery<{results: Violation[]}>({        
        queryKey: ['violations'],
        queryFn: getViolations
    });

    const { data: residents } = useQuery({
        queryKey: ['residents'],
        queryFn: getResidents
    });

    const createMutation = useMutation({
        mutationFn: createViolation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['violations'] });
            setIsCreateOpen(false);
            // Reset form
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
    
    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number, status: string }) => updateViolationStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['violations'] });
            setIsDetailOpen(false);
            toast({ title: "Status Updated" });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('resident', residentId);
        formData.append('rule_citation', ruleCitation);
        formData.append('description', description);
        formData.append('fine_amount', fineAmount);
        formData.append('status', 'open');
        if (photo) {
            formData.append('photo', photo);
        }
        createMutation.mutate(formData);
    };
    
    const filteredViolations = useMemo(() => {
        return violations?.results?.filter((v: Violation) => 
            v.rule_citation.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.resident.unit_number.toString().includes(searchTerm)
        );
    }, [violations, searchTerm]);

    return (
        <AdminLayout>
            <div className="p-8">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-light tracking-tight flex items-center gap-3">
                        <Ban className="h-8 w-8 text-destructive" />
                        Violation Tracking
                    </h1>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
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
                                {/* ... form fields ... */}
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
                            <Input placeholder="Search by rule or unit..." className="pl-8" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                    </div>
                    <table className="w-full text-sm">
                        {/* ... table head ... */}
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={6} className="p-8 text-center">Loading...</td></tr>
                            ) : (filteredViolations?.length ?? 0) === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No violations match your search.</td></tr>
                            ) : (
                                filteredViolations?.map((v: Violation) => (
                                    <tr key={v.id} className="border-t hover:bg-muted/50">
                                        {/* ... table cells ... */}
                                        <td className="p-4 text-right">
                                            <Button variant="ghost" size="sm" onClick={() => { setSelectedViolation(v); setIsDetailOpen(true); }}>Details</Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Violation Details</DialogTitle>
                            <DialogDescription>Review and manage the violation.</DialogDescription>
                        </DialogHeader>
                        {selectedViolation && (
                            <div className="mt-4 space-y-4">
                                <p><strong>Unit:</strong> {selectedViolation.resident.unit_number}</p>
                                <p><strong>Rule:</strong> {selectedViolation.rule_citation}</p>
                                <p><strong>Description:</strong> {selectedViolation.description}</p>
                                <p><strong>Fine:</strong> ${selectedViolation.fine_amount}</p>
                                {selectedViolation.photo && <img src={selectedViolation.photo} alt="Violation proof" className="rounded-md border max-w-full"/>}
                                <div className="flex items-center gap-4">
                                    <Label>Status</Label>
                                    <Select 
                                        defaultValue={selectedViolation.status} 
                                        onValueChange={status => updateStatusMutation.mutate({ id: selectedViolation.id, status })}
                                    >
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="open">Open</SelectItem>
                                            <SelectItem value="resolved">Resolved</SelectItem>
                                            <SelectItem value="paid">Paid</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

            </div>
        </AdminLayout>
    );
};

export default Violations;
