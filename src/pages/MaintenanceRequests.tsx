import { useLocation } from 'react-router-dom';
import MaintenanceRequestForm from '../components/MaintenanceRequestForm';
import MaintenanceRequestList from '../components/MaintenanceRequestList';

const MaintenanceRequests = () => {
  const location = useLocation();
  const isNewRequest = location.pathname.endsWith('/new');

  return (
    <div className="container mx-auto py-8">
      {isNewRequest ? (
        <>
          <h1 className="text-3xl font-bold text-center mb-8">Submit Maintenance Request</h1>
          <MaintenanceRequestForm />
        </>
      ) : (
        <MaintenanceRequestList />
      )}
    </div>
  );
};

export default MaintenanceRequests;