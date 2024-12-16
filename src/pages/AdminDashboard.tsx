import Header from "@/components/admin/Header";
import DashboardGrid from "@/components/admin/DashboardGrid";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-primary-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <Header />
        <DashboardGrid />
      </div>
    </div>
  );
};

export default AdminDashboard;