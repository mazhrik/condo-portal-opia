import { MaintenanceRequestForm } from "@/components/maintenance/MaintenanceRequestForm";
import { MaintenanceRequestList } from "@/components/maintenance/MaintenanceRequestList";

export default function MaintenancePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Maintenance Requests</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Submit New Request</h2>
        <MaintenanceRequestForm />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Requests</h2>
        <MaintenanceRequestList isAdmin={false} />
      </div>
    </div>
  );
}