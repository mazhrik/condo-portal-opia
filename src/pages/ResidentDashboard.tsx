import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, FileText, Building, CreditCard } from "lucide-react";

const ResidentDashboard = () => {
  return (
    <div className="min-h-screen bg-primary-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Welcome, John Doe</h1>
          <Button variant="outline" onClick={() => window.location.href = "/"}>
            Logout
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Bell className="w-8 h-8 text-primary" />
              <CardTitle>Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Building maintenance scheduled for next week.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Building className="w-8 h-8 text-primary" />
              <CardTitle>Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Submit Request</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Calendar className="w-8 h-8 text-primary" />
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Book Facility</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <CreditCard className="w-8 h-8 text-primary" />
              <CardTitle>Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Next payment due: May 1, 2024
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <FileText className="w-8 h-8 text-primary" />
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Documents
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResidentDashboard;