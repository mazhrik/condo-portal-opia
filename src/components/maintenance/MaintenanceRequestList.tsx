import React from 'react';
import { Badge } from "@/components/ui/badge";
import { MaintenanceRequest } from '@/types';

const MaintenanceRequestList = ({ requests }: { requests: MaintenanceRequest[] }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">{status}</Badge>;
      case 'in_progress':
        return <Badge variant="outline">{status}</Badge>;
      case 'completed':
        return <Badge variant="secondary">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div key={request.id} className="p-4 border rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{request.issue_type}</h3>
              <p className="text-sm text-gray-600">{request.description}</p>
            </div>
            {getStatusBadge(request.status)}
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Created: {new Date(request.created_at).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MaintenanceRequestList;