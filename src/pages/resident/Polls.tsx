
import { useState } from "react";
import { ResidentSidebar } from "@/components/resident/ResidentSidebar";
import { Vote, Loader2, CheckCircle } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ResidentLayout } from "@/components/resident/ResidentLayout";
import { getPolls, votePoll } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

const ResidentPolls = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});

    const { data: polls, isLoading } = useQuery({
        queryKey: ['polls'],
        queryFn: getPolls
    });

    const voteMutation = useMutation({
        mutationFn: ({ pollId, optionId }: { pollId: number, optionId: number }) => votePoll(pollId, optionId),
        onSuccess: () => {
            toast({ title: "Vote Recorded", description: "Thank you for your feedback!" });
            queryClient.invalidateQueries({ queryKey: ['polls'] });
            // Ideally backend returns "voted: true" or we store it locally/check history.
            // For now, simple success message.
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.response?.data?.error || "Failed to submit vote.",
                variant: "destructive"
            });
        }
    });

    const handleVote = (pollId: number) => {
        const optionId = selectedOptions[pollId];
        if (!optionId) {
            toast({ title: "Selection Required", description: "Please select an option.", variant: "destructive" });
            return;
        }
        voteMutation.mutate({ pollId, optionId });
    };

    return (
        <ResidentLayout>
            <div className="p-8">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-light tracking-tight flex items-center gap-3">
                        <Vote className="h-8 w-8" />
                        Community Polls
                    </h1>
                </header>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                    {isLoading ? (
                        <div className="col-span-2 text-center"><Loader2 className="animate-spin inline" /> Loading...</div>
                    ) : polls?.length === 0 ? (
                        <div className="col-span-2 text-center text-muted-foreground">No active polls at the moment.</div>
                    ) : (polls?.map((poll: any) => (
                        <Card key={poll.id}>
                            <CardHeader>
                                <CardTitle>{poll.question}</CardTitle>
                                <CardDescription>Cast your vote</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup
                                    value={selectedOptions[poll.id]?.toString()}
                                    onValueChange={(val) => setSelectedOptions({ ...selectedOptions, [poll.id]: parseInt(val) })}
                                    className="space-y-4"
                                >
                                    {poll.options.map((opt: any) => (
                                        <div key={opt.id} className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50 transition-colors">
                                            <RadioGroupItem value={opt.id.toString()} id={`poll-${poll.id}-opt-${opt.id}`} />
                                            <Label htmlFor={`poll-${poll.id}-opt-${opt.id}`} className="flex-1 cursor-pointer">{opt.text}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                                <div className="mt-6 flex justify-end">
                                    <Button
                                        onClick={() => handleVote(poll.id)}
                                        disabled={voteMutation.isPending || !selectedOptions[poll.id]}
                                    >
                                        {voteMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                                        Submit Vote
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )))}
                </div>
            </div>
        </ResidentLayout>
    );
};

export default ResidentPolls;
