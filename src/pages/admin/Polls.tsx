
import { useState } from "react";
import Header from "@/components/admin/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Loader2, Plus, Vote } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPolls, createPoll } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Polls = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newPollQuestion, setNewPollQuestion] = useState("");
    const [newPollOptions, setNewPollOptions] = useState(["", ""]);

    const { data: polls, isLoading } = useQuery({
        queryKey: ['polls'],
        queryFn: getPolls
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => createPoll(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['polls'] });
            setIsDialogOpen(false);
            setNewPollQuestion("");
            setNewPollOptions(["", ""]);
            toast({ title: "Poll Created", description: "New poll has been published." });
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to create poll.", variant: "destructive" });
        }
    });

    const handleCreatePoll = () => {
        if (!newPollQuestion || newPollOptions.some(opt => !opt)) {
            toast({ title: "Validation Error", description: "Please fill all fields.", variant: "destructive" });
            return;
        }
        createMutation.mutate({
            question: newPollQuestion,
            options: newPollOptions.map(text => ({ text })), 
        });
    };

    const addOption = () => setNewPollOptions([...newPollOptions, ""]);
    const updateOption = (index: number, value: string) => {
        const newOptions = [...newPollOptions];
        newOptions[index] = value;
        setNewPollOptions(newOptions);
    };
    
    const getChartData = (options: any[]) => {
        const totalVotes = options.reduce((sum, opt) => sum + (opt.vote_count || 0), 0);
        return options.map(opt => ({
            name: opt.text,
            votes: opt.vote_count || 0,
            percentage: totalVotes === 0 ? 0 : Math.round(((opt.vote_count || 0) / totalVotes) * 100)
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-background/50 p-8">
            <Header />
            <div className="relative max-w-7xl mx-auto space-y-8 mt-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-light flex items-center gap-2">
                        <Vote className="h-6 w-6" />
                        Community Polls
                    </h2>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" /> Create Poll
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Poll</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Question</Label>
                                    <Input value={newPollQuestion} onChange={e => setNewPollQuestion(e.target.value)} placeholder="e.g. What amenity should we improve?" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Options</Label>
                                    {newPollOptions.map((opt, i) => (
                                        <Input key={i} value={opt} onChange={e => updateOption(i, e.target.value)} placeholder={`Option ${i + 1}`} className="mb-2" />
                                    ))}
                                    <Button variant="outline" size="sm" onClick={addOption}>Add Option</Button>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreatePoll} disabled={createMutation.isPending}>
                                    {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {isLoading ? (
                        <div className="col-span-3 text-center"><Loader2 className="animate-spin inline" /> Loading...</div>
                    ) : polls?.map((poll: any) => (
                        <Card key={poll.id} className="glass border-white/20">
                            <CardHeader>
                                <CardTitle className="text-lg">{poll.question}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[200px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={getChartData(poll.options)} layout="vertical">
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                                            <Tooltip cursor={{ fill: 'transparent' }} />
                                            <Bar dataKey="votes" fill="#8884d8" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <p className="text-center text-xs text-muted-foreground mt-2">
                                    Total Votes: {poll.options.reduce((acc: number, curr: any) => acc + (curr.vote_count || 0), 0)}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Polls;
