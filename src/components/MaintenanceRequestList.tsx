import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface MaintenanceRequest {
  id: string;
  issue_type: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
}

const MaintenanceRequestList = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const { toast } = useToast();

  const fetchRequests = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: residentData } = await supabase
        .from('residents')
        .select('id')
        .eq('profile_id', userData.user.id)
        .single();

      if (!residentData) return;

      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('resident_id', residentData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch maintenance requests",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'normal': return 'bg-green-100 text-green-800';
      case 'high': return 'bg-yellow-100 text-yellow-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Maintenance Requests</h2>
        <Button onClick={() => window.location.href = '/maintenance-requests/new'}>
          New Request
        </Button>
      </div>

      <div className="grid gap-6">
        {requests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="capitalize">{request.issue_type}</CardTitle>
                  <CardDescription>
                    Submitted on {new Date(request.created_at).toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={getPriorityColor(request.priority)}>
                    {request.priority}
                  </Badge>
                  <Badge className={getStatusColor(request.status)}>
                    {request.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{request.description}</p>
            </CardContent>
          </Card>
        ))}
        
        {requests.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No maintenance requests found
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MaintenanceRequestList;