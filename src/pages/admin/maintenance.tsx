import { MaintenanceRequestList } from "@/components/maintenance/MaintenanceRequestList";

export default function AdminMaintenancePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Maintenance Requests Management</h1>
      <MaintenanceRequestList isAdmin={true} />
    </div>
  );
}