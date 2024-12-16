import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, FileText, Tool, CreditCard } from "lucide-react";

const ResidentDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">Resident Portal</h1>
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
              <Bell className="w-6 h-6 text-blue-600" />
              <CardTitle className="text-lg">Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">View latest building announcements</p>
              <Button className="w-full mt-4">View All</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Tool className="w-6 h-6 text-blue-600" />
              <CardTitle className="text-lg">Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Submit maintenance requests</p>
              <Button className="w-full mt-4">New Request</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Calendar className="w-6 h-6 text-blue-600" />
              <CardTitle className="text-lg">Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Book common facilities</p>
              <Button className="w-full mt-4">Book Now</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <CreditCard className="w-6 h-6 text-blue-600" />
              <CardTitle className="text-lg">Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">View and make payments</p>
              <Button className="w-full mt-4">Make Payment</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <FileText className="w-6 h-6 text-blue-600" />
              <CardTitle className="text-lg">Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Access important documents</p>
              <Button className="w-full mt-4">View All</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ResidentDashboard;