import Header from "@/components/admin/Header";
import DashboardGrid from "@/components/admin/DashboardGrid";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sidebar-background to-background p-8">
      <div 
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475')] opacity-5 bg-cover bg-center"
        style={{ zIndex: 0 }}
      />
      <div className="relative max-w-7xl mx-auto space-y-8 z-10">
        <Header />
        <DashboardGrid />
      </div>
    </div>
  );
};

export default AdminDashboard;