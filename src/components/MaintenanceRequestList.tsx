import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Get the resident ID for the current user
      const { data: residentData } = await supabase
        .from('residents')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (!residentData) throw new Error('Resident not found');

      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('resident_id', residentData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch maintenance requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'normal': return 'bg-blue-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">My Maintenance Requests</h2>
      {requests.length === 0 ? (
        <p className="text-center text-gray-500">No maintenance requests found.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{request.issue_type}</span>
                  <div className="flex gap-2">
                    <Badge className={getPriorityColor(request.priority)}>
                      {request.priority}
                    </Badge>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">{request.description}</p>
                <p className="text-sm text-gray-400">
                  Submitted on: {new Date(request.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaintenanceRequestList;