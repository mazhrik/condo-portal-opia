import { useEffect, useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type MaintenanceRequest = {
  id: string;
  issue_type: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  residents: {
    profiles: {
      first_name: string;
      last_name: string;
    };
  };
  apartments: {
    unit_number: string;
  };
};

export const MaintenanceRequestList = ({ isAdmin = false }) => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        let query = supabase
          .from('maintenance_requests')
          .select(`
            *,
            residents (
              profiles (
                first_name,
                last_name
              )
            ),
            apartments (
              unit_number
            )
          `)
          .order('created_at', { ascending: false });

        if (!isAdmin) {
          // For residents, only show their own requests
          const { data: residentData } = await supabase
            .from('residents')
            .select('id')
            .eq('profile_id', user.id)
            .single();

          if (residentData) {
            query = query.eq('resident_id', residentData.id);
          }
        }

        const { data, error } = await query;

        if (error) throw error;
        setRequests(data || []);
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to load maintenance requests",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();

    // Set up real-time subscription
    const channel = supabase
      .channel('maintenance_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'maintenance_requests' 
        }, 
        () => {
          fetchRequests(); // Refresh the list when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, toast]);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Table>
        <TableHeader>
          <TableRow>
            {isAdmin && <TableHead>Resident</TableHead>}
            <TableHead>Unit</TableHead>
            <TableHead>Issue Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              {isAdmin && (
                <TableCell>
                  {request.residents?.profiles?.first_name} {request.residents?.profiles?.last_name}
                </TableCell>
              )}
              <TableCell>{request.apartments?.unit_number}</TableCell>
              <TableCell className="capitalize">{request.issue_type}</TableCell>
              <TableCell>{request.description}</TableCell>
              <TableCell>
                <Badge variant={request.status === 'pending' ? 'secondary' : 'success'}>
                  {request.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={request.priority === 'high' ? 'destructive' : 'default'}>
                  {request.priority}
                </Badge>
              </TableCell>
              <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};