import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building } from "lucide-react";
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
    queryFn: getMaintenanceRequests,
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
      status: 'pending'
    });
  };

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Maintenance Requests</h1>
        <p className="text-gray-600">Submit and track your maintenance requests</p>
      </header>

      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <Building className="w-8 h-8 text-primary" />
            <CardTitle>Active Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {isLoading ? (
                <p>Loading requests...</p>
              ) : (
                <>
                  <p className="text-sm font-medium">
                    Active Requests: {requests?.filter(r => r.status !== 'completed').length || 0}
                  </p>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full">Submit New Request</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>New Maintenance Request</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <Input
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full">
                          Submit Request
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <div className="mt-4 space-y-2">
                    {requests?.map((request) => (
                      <div key={request.id} className="border p-3 rounded-lg">
                        <p className="font-medium">{request.title}</p>
                        <p className="text-sm text-gray-600">{request.description}</p>
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
  );
};

export default Maintenance;