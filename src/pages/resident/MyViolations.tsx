import { useState } from "react";
import { ResidentLayout } from "@/components/resident/ResidentLayout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getMyViolations, createPaymentIntent } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Ban, AlertCircle, CheckCircle, DollarSign, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const MyViolations = () => {
    const { toast } = useToast();
    const { data: violations, isLoading } = useQuery({
        queryKey: ['my-violations'],
        queryFn: getMyViolations,
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open': return <Badge variant="destructive">Open</Badge>;
            case 'resolved': return <Badge className="bg-green-500">Resolved</Badge>;
            case 'paid': return <Badge className="bg-blue-500">Paid</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <ResidentLayout>
            <div className="p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-light tracking-tight flex items-center gap-3">
                            <Ban className="h-8 w-8 text-red-500" />
                            My Violations
                        </h1>
                        <p className="text-muted-foreground mt-2">View and manage violation notices.</p>
                    </div>
                </header>

                <div className="grid gap-6">
                    {isLoading ? (
                        <div className="text-center p-8"><Loader2 className="animate-spin inline" /> Loading...</div>
                    ) : violations?.length === 0 ? (
                        <div className="text-center text-muted-foreground p-12 border rounded-lg border-dashed">
                            No violations on record. Keep up the good work!
                        </div>
                    ) : (
                        violations?.map((v: any) => (
                            <Card key={v.id} className="border-l-4 border-l-red-500">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-xl flex items-center gap-2">
                                                {v.rule_citation || "Violation Notice"}
                                                {getStatusBadge(v.status)}
                                            </CardTitle>
                                            <CardDescription>{v.created_at ? new Date(v.created_at).toLocaleDateString() : 'N/A'}</CardDescription>
                                        </div>
                                        {v.fine_amount > 0 && (
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-red-600">${v.fine_amount}</div>
                                                <div className="text-xs text-muted-foreground">Fine Amount</div>
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="mb-4">{v.description}</p>
                                    {v.photo && (
                                        <div className="mt-4">
                                            <p className="text-sm font-medium mb-2 flex items-center"><ImageIcon className="w-4 h-4 mr-1" /> Proof Photo:</p>
                                            <img src={v.photo} alt="Violation Proof" className="max-w-xs rounded-md border" />
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="flex justify-end gap-2 bg-muted/20 p-4">
                                    {v.status === 'open' && v.fine_amount > 0 && (
                                        <Button variant="default" onClick={() => toast({ title: "Coming Soon!", description: "Online fine payment will be available soon." })}>
                                            <DollarSign className="w-4 h-4 mr-2" /> Pay Fine
                                        </Button>
                                    )}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline">Appeal</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Appeal Violation</DialogTitle>
                                                <DialogDescription>Submit an appeal for this violation. Please provide a detailed explanation.</DialogDescription>
                                            </DialogHeader>
                                            <div className="mt-4">
                                                <textarea className="w-full h-32 p-2 border rounded-md" placeholder="Your reason for appealing..."></textarea>
                                            </div>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => toast({ title: "Coming Soon!", description: "The appeals process will be available soon." })}>Submit Appeal</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </ResidentLayout>
    );
};

export default MyViolations;
