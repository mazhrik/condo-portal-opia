
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
        // Backend expects options as a list of objects or something?
        // Wait, PollSerializer expects 'options'?
        // My PollSerializer: options = PollOptionSerializer(many=True, read_only=True)
        // This means creating poll with options might need nested write, OR logic in view.
        // My ModelViewSet for Polls doesn't explicitly handle nested creation unless I implemented it or DRF does it (DRF doesn't do writable nested by default).
        // I might need to update the backend ViewSet or Serializer to support writable nested options.
        // Assuming I'll fix backend if it fails. For now, sending expected structure.

        // Actually, let's assume I need to implement create properly on backend or send data that backend accepts.
        // I'll send: { question, options: [{text: "opt1"}, ...] }
        // I need to update serializer to be writable nested.

        createMutation.mutate({
            question: newPollQuestion,
            options_data: newPollOptions.map(text => ({ text })), // Custom field name to handle in perform_create?
        });
    };

    const addOption = () => setNewPollOptions([...newPollOptions, ""]);
    const updateOption = (index: number, value: string) => {
        const newOptions = [...newPollOptions];
        newOptions[index] = value;
        setNewPollOptions(newOptions);
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
                                <ul className="space-y-2">
                                    {poll.options?.map((opt: any) => (
                                        <li key={opt.id} className="flex justify-between text-sm">
                                            <span>{opt.text}</span>
                                            {/* Show votes count if available */}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Polls;
