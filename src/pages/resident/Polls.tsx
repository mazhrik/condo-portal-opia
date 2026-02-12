
import { useState, useMemo, useCallback } from "react";
import { ResidentSidebar } from "@/components/resident/ResidentSidebar";
import { Vote, Loader2, CheckCircle, BarChart2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ResidentLayout } from "@/components/resident/ResidentLayout";
import { getPolls, votePoll } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ResidentPolls = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
    const [votedPolls, setVotedPolls] = useState<Record<number, boolean>>({});

    const { data: polls, isLoading } = useQuery({
        queryKey: ['polls'],
        queryFn: getPolls
    });

    const voteMutation = useMutation({
        mutationFn: ({ pollId, optionId }: { pollId: number, optionId: number }) => votePoll(pollId, optionId),
        onSuccess: (_, variables) => {
            toast({ title: "Vote Recorded", description: "Thank you for your feedback!" });
            setVotedPolls(prev => ({ ...prev, [variables.pollId]: true }));
            queryClient.invalidateQueries({ queryKey: ['polls'] });
        },
        onError: (error: any, variables) => {
            if (error.response?.status === 400 && error.response?.data?.detail?.includes("already voted")) {
                toast({
                    title: "Already Voted",
                    description: "You have already cast your vote for this poll.",
                    variant: "default"
                });
                setVotedPolls(prev => ({ ...prev, [variables.pollId]: true }));
            } else {
                toast({
                    title: "Error",
                    description: error.response?.data?.error || "Failed to submit vote.",
                    variant: "destructive"
                });
            }
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

    const getChartData = useCallback((options: any[]) => {
        const totalVotes = options.reduce((sum, opt) => sum + (opt.vote_count || 0), 0);
        return options.map(opt => ({
            name: opt.text,
            votes: opt.vote_count || 0,
            percentage: totalVotes === 0 ? 0 : Math.round(((opt.vote_count || 0) / totalVotes) * 100)
        }));
    }, []);

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
                    ) : (polls?.map((poll: any) => {
                        const hasVoted = votedPolls[poll.id] || poll.user_voted;

                        return (
                            <Card key={poll.id} className={hasVoted ? "bg-muted/20" : ""}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle>{poll.question}</CardTitle>
                                        {hasVoted && <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" /> Voted</Badge>}
                                    </div>
                                    <CardDescription>{hasVoted ? "Results" : "Cast your vote"}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {hasVoted ? (
                                        <div className="h-[200px] w-full mt-4">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={getChartData(poll.options)} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                                    <XAxis type="number" hide />
                                                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
                                                    <Bar dataKey="votes" fill="#8884d8" radius={[0, 4, 4, 0]}>
                                                        {getChartData(poll.options).map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index % 4]} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                            <div className="text-center text-xs text-muted-foreground mt-2">
                                                Total Votes: {poll.options.reduce((acc: number, curr: any) => acc + (curr.vote_count || 0), 0)}
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <RadioGroup
                                                value={selectedOptions[poll.id]?.toString()}
                                                onValueChange={(val) => setSelectedOptions({ ...selectedOptions, [poll.id]: parseInt(val) })}
                                                className="space-y-4"
                                            >
                                                {poll.options.map((opt: any) => (
                                                    <div key={opt.id} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                                                        <RadioGroupItem value={opt.id.toString()} id={`poll-${poll.id}-opt-${opt.id}`} />
                                                        <Label htmlFor={`poll-${poll.id}-opt-${opt.id}`} className="flex-1 cursor-pointer font-normal">{opt.text}</Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                            <div className="mt-6 flex justify-end">
                                                <Button
                                                    onClick={() => handleVote(poll.id)}
                                                    disabled={voteMutation.isPending || !selectedOptions[poll.id]}
                                                >
                                                    {voteMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Vote className="mr-2 h-4 w-4" />}
                                                    Submit Vote
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        )
                    }))}
                </div>
            </div>
        </ResidentLayout>
    );
};

export default ResidentPolls;
