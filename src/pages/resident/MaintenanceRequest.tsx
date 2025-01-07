import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

const MaintenanceRequest = () => {
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // First get the current user's resident record
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: residentData, error: residentError } = await supabase
        .from('residents')
        .select('id, apartment_id')
        .eq('profile_id', user.id)
        .single();

      if (residentError || !residentData) {
        throw new Error('Could not find resident information');
      }

      // Now create the maintenance request
      const { error: submitError } = await supabase
        .from('maintenance_requests')
        .insert({
          resident_id: residentData.id,
          apartment_id: residentData.apartment_id,
          issue_type: issueType,
          description: description,
          status: 'pending',
          priority: 'normal'
        });

      if (submitError) throw submitError;

      toast({
        title: "Success",
        description: "Maintenance request submitted successfully",
      });

      navigate('/resident/maintenance');
    } catch (error) {
      console.error('Error submitting maintenance request:', error);
      toast({
        title: "Error",
        description: "Failed to submit maintenance request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Submit Maintenance Request</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label htmlFor="issueType" className="block text-sm font-medium mb-1">
            Issue Type
          </label>
          <select
            id="issueType"
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Select Issue Type</option>
            <option value="plumbing">Plumbing</option>
            <option value="electrical">Electrical</option>
            <option value="appliance">Appliance</option>
            <option value="hvac">HVAC</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md"
            rows={4}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default MaintenanceRequest;