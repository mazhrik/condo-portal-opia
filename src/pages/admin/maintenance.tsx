import React from 'react';
import MaintenanceRequestList from "@/components/maintenance/MaintenanceRequestList";
import { MaintenanceRequest } from '@/types';

const AdminMaintenance = () => {
  const requests: MaintenanceRequest[] = []; // Example data, replace with actual data fetching logic

  return (
    <div>
      <h1>Admin Maintenance</h1>
      <MaintenanceRequestList requests={requests} />
    </div>
  );
};

export default AdminMaintenance;
