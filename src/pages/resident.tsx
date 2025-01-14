import { MaintenanceRequestForm } from "@/components/MaintenanceRequestForm";
import { Toaster } from "@/components/ui/toaster";

const ResidentPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Submit Maintenance Request</h1>
      <MaintenanceRequestForm />
      <Toaster />
    </div>
  );
};

export default ResidentPage;