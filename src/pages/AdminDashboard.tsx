import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Building,
  Bell,
  BarChart,
  Calendar,
  CreditCard,
  Settings,
  FileText,
  MessageSquare,
  Shield,
  Car
} from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-primary-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-gray-600">Building Management System</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline">Settings</Button>
            <Button variant="outline" onClick={() => window.location.href = "/"}>
              Logout
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Users className="w-8 h-8 text-primary" />
              <CardTitle>Residents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-2xl font-bold">150</div>
                  <p className="text-sm text-gray-600">Total Residents</p>
                </div>
                <div className="space-y-2">
                  <Button className="w-full">Manage Residents</Button>
                  <Button variant="outline" className="w-full">View Directory</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Building className="w-8 h-8 text-primary" />
              <CardTitle>Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-sm text-gray-600">Pending Requests</p>
                </div>
                <div className="space-y-2">
                  <Button className="w-full">View Requests</Button>
                  <Button variant="outline" className="w-full">Maintenance Schedule</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Bell className="w-8 h-8 text-primary" />
              <CardTitle>Announcements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button className="w-full">Create Announcement</Button>
                <Button variant="outline" className="w-full">View History</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Building className="w-8 h-8 text-primary" />
              <CardTitle>Units</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-2xl font-bold">200</div>
                  <p className="text-sm text-gray-600">Total Units</p>
                </div>
                <div className="space-y-2">
                  <Button className="w-full">Manage Units</Button>
                  <Button variant="outline" className="w-full">Occupancy Report</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Calendar className="w-8 h-8 text-primary" />
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-sm text-gray-600">Active Bookings Today</p>
                </div>
                <div className="space-y-2">
                  <Button className="w-full">Manage Bookings</Button>
                  <Button variant="outline" className="w-full">Facility Status</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <CreditCard className="w-8 h-8 text-primary" />
              <CardTitle>Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-2xl font-bold">$45,000</div>
                  <p className="text-sm text-gray-600">Monthly Collections</p>
                </div>
                <div className="space-y-2">
                  <Button className="w-full">Payment Records</Button>
                  <Button variant="outline" className="w-full">Outstanding Dues</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Car className="w-8 h-8 text-primary" />
              <CardTitle>Parking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-2xl font-bold">180/200</div>
                  <p className="text-sm text-gray-600">Occupied Spots</p>
                </div>
                <Button className="w-full">Manage Parking</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Shield className="w-8 h-8 text-primary" />
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full">Access Logs</Button>
                <Button variant="outline" className="w-full">Security Reports</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <BarChart className="w-8 h-8 text-primary" />
              <CardTitle>Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full">Financial Reports</Button>
                <Button variant="outline" className="w-full">Usage Analytics</Button>
                <Button variant="outline" className="w-full">Export Data</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <FileText className="w-8 h-8 text-primary" />
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full">Building Policies</Button>
                <Button variant="outline" className="w-full">Legal Documents</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <MessageSquare className="w-8 h-8 text-primary" />
              <CardTitle>Communications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full">Message Center</Button>
                <Button variant="outline" className="w-full">Email Templates</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Settings className="w-8 h-8 text-primary" />
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full">System Settings</Button>
                <Button variant="outline" className="w-full">User Permissions</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;