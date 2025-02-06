import React from 'react';
import MaintenanceRequestList from "@/components/maintenance/MaintenanceRequestList";
import { MaintenanceRequestForm } from "@/components/maintenance/MaintenanceRequestForm";
import { MaintenanceRequest } from '@/types';

const ResidentMaintenance = () => {
  const requests: MaintenanceRequest[] = []; // This should be populated with actual data

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Maintenance Requests</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Submit New Request</h2>
          <MaintenanceRequestForm />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Requests</h2>
          <MaintenanceRequestList requests={requests} />
        </div>
      </div>
    </div>
  );
};

export default ResidentMaintenance;