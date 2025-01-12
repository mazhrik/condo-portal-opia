import { MaintenanceRequestForm } from "@/components/MaintenanceRequestForm";

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Submit a Maintenance Request</h1>
      <MaintenanceRequestForm />
    </div>
  );
}