import React from 'react';
import { Badge } from "@/components/ui/badge";
import { MaintenanceRequest } from "@/types"; // Assuming this import is necessary

const MaintenanceRequestList = ({ requests }: { requests: MaintenanceRequest[] }) => {
  return (
    <div>
      {requests.map((request) => (
        <div key={request.id}>
          <h3>{request.title}</h3>
          {getStatusBadge(request.status)}
        </div>
      ))}
    </div>
  );
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return <Badge variant="secondary">Completed</Badge>; // Changed from 'success' to 'secondary'
    case 'pending':
      return <Badge variant="outline">Pending</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
};

export default MaintenanceRequestList;
