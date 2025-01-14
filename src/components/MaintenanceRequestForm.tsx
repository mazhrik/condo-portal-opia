import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function MaintenanceRequestForm() {
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // First, get the current user's resident record
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to submit a maintenance request",
          variant: "destructive",
        });
        return;
      }

      // Get the resident record for the current user
      const { data: residentData, error: residentError } = await supabase
        .from('residents')
        .select('id, apartment_id')
        .eq('profile_id', user.id)
        .single();

      if (residentError || !residentData) {
        console.error('Error fetching resident:', residentError);
        toast({
          title: "Error",
          description: "Could not find your resident record",
          variant: "destructive",
        });
        return;
      }

      // Submit the maintenance request
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

      if (submitError) {
        console.error('Error submitting request:', submitError);
        toast({
          title: "Error",
          description: "Failed to submit maintenance request. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Maintenance request submitted successfully!",
      });

      // Clear the form
      setIssueType("");
      setDescription("");

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6">
      <div>
        <label htmlFor="issueType" className="block text-sm font-medium text-gray-700">
          Issue Type
        </label>
        <select
          id="issueType"
          value={issueType}
          onChange={(e) => setIssueType(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        >
          <option value="">Select an issue type</option>
          <option value="plumbing">Plumbing</option>
          <option value="electrical">Electrical</option>
          <option value="hvac">HVAC</option>
          <option value="appliance">Appliance</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={4}
          required
          placeholder="Please describe the issue in detail..."
        />
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Submit Request
      </button>
    </form>
  );
}