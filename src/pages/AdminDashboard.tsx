import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Building,
  Bell,
  BarChart,
} from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-primary-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
          <Button variant="outline" onClick={() => window.location.href = "/"}>
            Logout
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Users className="w-8 h-8 text-primary" />
              <CardTitle>Residents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">150</div>
              <p className="text-sm text-gray-600">Total Residents</p>
              <Button className="w-full mt-4">Manage Residents</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Building className="w-8 h-8 text-primary" />
              <CardTitle>Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-sm text-gray-600">Pending Requests</p>
              <Button className="w-full mt-4">View Requests</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Bell className="w-8 h-8 text-primary" />
              <CardTitle>Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Create Announcement</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Building className="w-8 h-8 text-primary" />
              <CardTitle>Units</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">200</div>
              <p className="text-sm text-gray-600">Total Units</p>
              <Button className="w-full mt-4">Manage Units</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <BarChart className="w-8 h-8 text-primary" />
              <CardTitle>Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Generate Reports</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;