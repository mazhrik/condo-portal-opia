import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Loader2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ResidentLayout } from "@/components/resident/ResidentLayout";
import { getMaintenanceRequests, createMaintenanceRequest } from "@/utils/api";

const Maintenance = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch maintenance requests
  const { data: requests, isLoading } = useQuery({
    queryKey: ['maintenance-requests'],
    queryFn: async () => {
      try {
        return await getMaintenanceRequests();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch maintenance requests",
          variant: "destructive",
        });
        throw error;
      }
    }
  });

  const createMutation = useMutation({
    mutationFn: createMaintenanceRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-requests"] });
      setIsDialogOpen(false);
      setTitle("");
      setDescription("");
      toast({
        title: "Success",
        description: "Maintenance request submitted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit maintenance request",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      title,
      description,
      status: "pending",
      priority: "medium",
    });
  };

  return (
    <ResidentLayout>
      <div className="p-8 relative">
        <div className="max-w-7xl mx-auto space-y-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-primary">Maintenance Requests</h1>
            <p className="text-gray-600">Submit and track your maintenance requests</p>
          </header>

          <div className="space-y-6">
            <Card className="glass">
              <CardHeader className="flex flex-row items-center space-x-4">
                <Building className="w-8 h-8 text-amber-500" />
                <CardTitle className="text-primary">Active Requests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-gray-700">
                        Active Requests: {requests?.filter((r: any) => r.status !== 'completed').length || 0}
                      </p>
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="w-full btn-gradient">Submit New Request</Button>
                        </DialogTrigger>
                        <DialogContent className="glass border-white/10">
                          <DialogHeader>
                            <DialogTitle className="text-primary">New Maintenance Request</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                              placeholder="Title"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              required
                              className="bg-white/10 border-white/20 text-foreground placeholder:text-gray-400"
                            />
                            <Textarea
                              placeholder="Description"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              required
                              className="bg-white/10 border-white/20 text-foreground placeholder:text-gray-400"
                            />
                            <Button type="submit" className="w-full btn-gradient" disabled={createMutation.isPending}>
                              {createMutation.isPending ? "Submitting..." : "Submit Request"}
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <div className="mt-4 space-y-2">
                        {requests?.map((request: any) => (
                          <div key={request.id} className="border border-white/10 bg-white/5 p-3 rounded-lg">
                            <p className="font-medium text-primary">{request.title}</p>
                            <p className="text-sm text-gray-700">{request.description}</p>
                            <p className="text-sm text-gray-500 mt-1">Status: {request.status}</p>
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
    </ResidentLayout>
  );
};

export default Maintenance;
