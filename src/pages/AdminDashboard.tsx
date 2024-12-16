import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Tool, Bell, Building, BarChart } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">Admin Portal</h1>
            <Button variant="outline" onClick={() => window.location.href = "/"}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Users className="w-6 h-6 text-blue-600" />
              <CardTitle className="text-lg">Residents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">150</div>
              <p className="text-sm text-gray-600">Total Residents</p>
              <Button className="w-full mt-4">Manage Residents</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Tool className="w-6 h-6 text-blue-600" />
              <CardTitle className="text-lg">Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-sm text-gray-600">Pending Requests</p>
              <Button className="w-full mt-4">View Requests</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Bell className="w-6 h-6 text-blue-600" />
              <CardTitle className="text-lg">Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Manage building announcements</p>
              <Button className="w-full mt-4">Create New</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Building className="w-6 h-6 text-blue-600" />
              <CardTitle className="text-lg">Units</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">200</div>
              <p className="text-sm text-gray-600">Total Units</p>
              <Button className="w-full mt-4">Manage Units</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <BarChart className="w-6 h-6 text-blue-600" />
              <CardTitle className="text-lg">Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Generate and view reports</p>
              <Button className="w-full mt-4">View Reports</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;