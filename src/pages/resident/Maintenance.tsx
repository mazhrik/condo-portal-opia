
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Loader2 } from "lucide-react";
import { getMaintenanceRequests, createMaintenanceRequest } from "@/utils/api";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Maintenance = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { data: requests, isLoading } = useQuery({
    queryKey: ['maintenance-requests'],
    queryFn: getMaintenanceRequests
  });

  const createMutation = useMutation({
    mutationFn: createMaintenanceRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-requests'] });
      setIsDialogOpen(false);
      setTitle("");
      setDescription("");
      toast({
        title: "Success",
        description: "Maintenance request submitted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit maintenance request",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      title,
      description,
      status: 'pending',
      priority: 'medium'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50 p-8">
      <div className="fixed inset-0 -z-10">
        <img
          src="/lovable-uploads/5f307eb2-750f-41ff-aeb3-659ec419eb29.png"
          alt="Modern interior"
          className="w-full h-full object-cover opacity-[0.03]"
        />
      </div>
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background to-background/50" />
      <div className="relative max-w-7xl mx-auto space-y-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">Maintenance Requests</h1>
          <p className="text-gray-400">Submit and track your maintenance requests</p>
        </header>

        <div className="space-y-6">
          <Card className="glass">
            <CardHeader className="flex flex-row items-center space-x-4">
              <Building className="w-8 h-8 text-amber-500" />
              <CardTitle className="text-white">Active Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-medium text-gray-300">
                      Active Requests: {requests?.filter(r => r.status !== 'completed').length || 0}
                    </p>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full btn-gradient">Submit New Request</Button>
                      </DialogTrigger>
                      <DialogContent className="glass border-white/10">
                        <DialogHeader>
                          <DialogTitle className="text-white">New Maintenance Request</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <Input
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          />
                          <Textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          />
                          <Button type="submit" className="w-full btn-gradient">
                            Submit Request
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <div className="mt-4 space-y-2">
                      {requests?.map((request) => (
                        <div key={request.id} className="border border-white/10 bg-white/5 p-3 rounded-lg">
                          <p className="font-medium text-white">{request.title}</p>
                          <p className="text-sm text-gray-300">{request.description}</p>
                          <p className="text-sm text-gray-400 mt-1">Status: {request.status}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
