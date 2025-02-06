import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const MaintenanceRequestForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    issueType: '',
    priority: 'normal',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Get the resident information for the current user
      const { data: residentData, error: residentError } = await supabase
        .from('residents')
        .select('id, apartment_id')
        .eq('profile_id', user.id)
        .single();

      if (residentError || !residentData) {
        throw new Error('Resident information not found');
      }

      const { error } = await supabase.from('maintenance_requests').insert({
        resident_id: residentData.id,
        apartment_id: residentData.apartment_id,
        issue_type: formData.issueType,
        description: formData.description,
        priority: formData.priority,
        status: 'pending'
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Maintenance request submitted successfully",
      });
      navigate('/maintenance-requests');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit maintenance request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <div className="space-y-2">
        <label htmlFor="issueType" className="text-sm font-medium">Issue Type</label>
        <Input
          id="issueType"
          value={formData.issueType}
          onChange={(e) => setFormData(prev => ({ ...prev, issueType: e.target.value }))}
          required
          placeholder="e.g., Plumbing, Electrical, etc."
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="priority" className="text-sm font-medium">Priority</label>
        <Select
          value={formData.priority}
          onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
          placeholder="Please describe the issue in detail"
          rows={4}
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Request'}
      </Button>
    </form>
  );
};

export default MaintenanceRequestForm;