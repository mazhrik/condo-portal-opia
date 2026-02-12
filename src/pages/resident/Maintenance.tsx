
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
import { getMaintenanceRequests, createMaintenanceRequest, MaintenancePriority } from "@/utils/api";
import { formatToUserTimezone } from "@/utils/date";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Maintenance = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<MaintenancePriority>("low");

  const { data: requests, isLoading } = useQuery({
    queryKey: ['maintenance-requests'],
    queryFn: getMaintenanceRequests
  });

  const createMutation = useMutation({
    mutationFn: createMaintenanceRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-requests"] });
      setIsDialogOpen(false);
      setTitle("");
      setDescription("");
      setPriority("low");
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
    createMutation.mutate({ title, description, priority });
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
              <CardHeader className="flex flex-row items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <Building className="w-8 h-8 text-amber-500" />
                  <CardTitle className="text-primary">Your Requests</CardTitle>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="btn-gradient">Submit New Request</Button>
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
                      <Select onValueChange={(value: MaintenancePriority) => setPriority(value)} defaultValue={priority}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-foreground">
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button type="submit" className="w-full btn-gradient" disabled={createMutation.isPending}>
                        {createMutation.isPending ? "Submitting..." : "Submit Request"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                    </div>
                  ) : requests?.results.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No requests yet.</p>
                  ) : (
                    <div className="mt-4 space-y-4">
                      {requests?.results.map((request: any) => (
                        <div key={request.id} className="border border-white/10 bg-white/5 p-4 rounded-lg flex justify-between items-start">
                          <div>
                            <p className="font-medium text-primary">{request.title}</p>
                            <p className="text-sm text-gray-400 mt-1">{request.description}</p>
                            <p className="text-xs text-gray-500 mt-2">{formatToUserTimezone(request.created_at)}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              request.status === 'completed' || request.status === 'closed' ? 'bg-green-500/10 text-green-500' :
                              request.status === 'in_progress' || request.status === 'assigned' ? 'bg-blue-500/10 text-blue-500' :
                              'bg-yellow-500/10 text-yellow-500'
                            }`}>
                              {request.status}
                            </span>
                            <p className={`text-xs mt-2 font-medium ${
                                request.priority === 'high' ? 'text-red-400' :
                                request.priority === 'medium' ? 'text-yellow-400' :
                                'text-green-400'
                            }`}>
                                Priority: {request.priority}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
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
