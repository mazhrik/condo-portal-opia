import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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

const MaintenanceRequestForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    issueType: "",
    description: "",
    priority: "normal",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error("User error:", userError);
        throw new Error("You must be logged in to submit a request");
      }

      // Get the resident record for the current user
      const { data: residentData, error: residentError } = await supabase
        .from("residents")
        .select("id, apartment_id")
        .eq("profile_id", user.id)
        .single();

      if (residentError || !residentData) {
        console.error("Resident error:", residentError);
        throw new Error("Could not find your resident record");
      }

      console.log("Resident data found:", residentData);

      // Submit the maintenance request
      const { data: requestData, error: requestError } = await supabase
        .from("maintenance_requests")
        .insert([
          {
            resident_id: residentData.id,
            apartment_id: residentData.apartment_id,
            issue_type: formData.issueType,
            description: formData.description,
            priority: formData.priority,
            status: "pending"
          }
        ])
        .select()
        .single();

      if (requestError) {
        console.error("Request submission error:", requestError);
        throw new Error("Failed to submit maintenance request");
      }

      console.log("Request submitted successfully:", requestData);

      toast({
        title: "Success",
        description: "Maintenance request submitted successfully",
      });

      // Reset form
      setFormData({
        issueType: "",
        description: "",
        priority: "normal",
      });

    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit request",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Select
          value={formData.issueType}
          onValueChange={(value) => setFormData({ ...formData, issueType: value })}
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

      <div>
        <Select
          value={formData.priority}
          onValueChange={(value) => setFormData({ ...formData, priority: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="emergency">Emergency</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Textarea
          placeholder="Describe the issue..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="min-h-[100px]"
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Request"}
      </Button>
    </form>
  );
};

export default MaintenanceRequestForm;