import { useState } from "react";
import Header from "@/components/admin/Header";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMaintenanceRequests, updateMaintenanceRequest } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface MaintenanceRequest {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  created_at: string;
}

const MaintenanceRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: requests, isLoading } = useQuery<MaintenanceRequest[]>({
    queryKey: ['maintenance-requests'],
    queryFn: getMaintenanceRequests
  });

  const updateMutation = useMutation({
    mutationFn: (params: { id: number; data: { status: string } }) => 
      updateMaintenanceRequest(params.id, params.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-requests'] });
      toast({
        title: "Status updated",
        description: "The maintenance request has been updated successfully.",
      });
      setSelectedRequest(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update the maintenance request.",
        variant: "destructive",
      });
    },
  });

  const handleStatusUpdate = (id: number, status: string) => {
    updateMutation.mutate({ id, data: { status } });
  };

  const handleScheduleMaintenance = () => {
    navigate('/admin/maintenance/schedule');
  };

  const filteredRequests = requests?.filter(request =>
    request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50 p-8">
      <div className="fixed inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1554995207-c18c203602cb"
          alt="Modern interior"
          className="w-full h-full object-cover opacity-[0.03]"
        />
      </div>
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background to-background/50" />
      <div className="relative max-w-7xl mx-auto space-y-8">
        <Header />
        <div className="grid gap-6">
          <div className="p-6 rounded-lg glass border border-primary/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-light">Maintenance Requests</h2>
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-[300px] bg-background/50 border-primary/10"
                  />
                </div>
                <Button 
                  onClick={handleScheduleMaintenance}
                  className="bg-primary/90 hover:bg-primary transition-colors duration-300"
                >
                  Schedule Maintenance
                </Button>
              </div>
            </div>
            <div className="rounded-lg border border-primary/10 bg-card/30 backdrop-blur-md">
              <Table>
                <TableHeader>
                  <TableRow className="border-primary/10">
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredRequests?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        <div className="flex flex-col items-center gap-2 py-8">
                          <AlertCircle className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">No maintenance requests found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests?.map((request) => (
                      <TableRow key={request.id} className="border-primary/10">
                        <TableCell>{request.title}</TableCell>
                        <TableCell>
                          <Select
                            defaultValue={request.status}
                            onValueChange={(value) => handleStatusUpdate(request.id, value)}
                          >
                            <SelectTrigger className="w-[120px] bg-background/50 border-primary/10">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            request.priority === 'high' 
                              ? 'bg-red-500/10 text-red-500' 
                              : request.priority === 'medium'
                              ? 'bg-yellow-500/10 text-yellow-500'
                              : 'bg-green-500/10 text-green-500'
                          }`}>
                            {request.priority}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setSelectedRequest(request)}
                              className="border-primary/10 hover:bg-primary/10"
                            >
                              View Details
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceRequests;