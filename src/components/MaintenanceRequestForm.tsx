import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
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
  const [formData, setFormData] = useState({
    issueType: '',
    description: '',
    priority: 'normal'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          title: "Error",
          description: "You must be logged in to submit a request",
          variant: "destructive",
        });
        return;
      }

      // Get the resident information for the current user
      const { data: residentData } = await supabase
        .from('residents')
        .select('id, apartment_id')
        .eq('profile_id', userData.user.id)
        .single();

      if (!residentData) {
        toast({
          title: "Error",
          description: "Resident information not found",
          variant: "destructive",
        });
        return;
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
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit maintenance request",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Issue Type</label>
        <Select
          onValueChange={(value) => setFormData({ ...formData, issueType: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select issue type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="plumbing">Plumbing</SelectItem>
            <SelectItem value="electrical">Electrical</SelectItem>
            <SelectItem value="hvac">HVAC</SelectItem>
            <SelectItem value="appliance">Appliance</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Priority</label>
        <Select
          onValueChange={(value) => setFormData({ ...formData, priority: value })}
          defaultValue="normal"
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="emergency">Emergency</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Please describe the issue in detail"
          required
          className="h-32"
        />
      </div>

      <Button type="submit" className="w-full">
        Submit Request
      </Button>
    </form>
  );
};

export default MaintenanceRequestForm;