import { SidebarProvider } from "@/components/ui/sidebar";
import { ResidentSidebar } from "@/components/resident/ResidentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Bell, Calendar, FileText, Building, CreditCard, MessageSquare, 
  Car, Users, Phone, Menu
} from "lucide-react";
import LocalServices from "@/components/resident/LocalServices";
import { useState } from "react";

const ResidentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-primary-100">
        <div 
          className={`fixed md:static top-0 left-0 h-full transition-transform duration-300 ease-in-out transform 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-50`}
        >
          <ResidentSidebar />
        </div>
        <div className="flex-1 p-8 relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="fixed top-4 left-4 z-50 md:hidden hover:bg-gray-100"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Background Image */}
          <div className="fixed inset-0 -z-10">
            <div 
              className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750')] 
              bg-cover bg-center bg-fixed opacity-[0.03]"
            ></div>
            <div className="absolute inset-0 bg-gradient-to-br from-background to-background/50"></div>
          </div>

          <div className="max-w-7xl mx-auto space-y-8 relative z-10">
            <header className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-primary">Welcome, John Doe</h1>
                <p className="text-gray-600">Unit 501 • Building A</p>
              </div>
              <div className="flex gap-4">
                <Button variant="outline">My Profile</Button>
                <Button variant="outline" onClick={() => window.location.href = "/"}>
                  Logout
                </Button>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Bell className="w-8 h-8 text-primary" />
              <CardTitle>Announcements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-primary p-3 bg-primary-100">
                <p className="font-semibold">Building Maintenance</p>
                <p className="text-sm text-gray-600">Scheduled for next week</p>
              </div>
              <div className="border-l-4 border-primary p-3 bg-primary-100">
                <p className="font-semibold">Community Meeting</p>
                <p className="text-sm text-gray-600">This Saturday at 10 AM</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Building className="w-8 h-8 text-primary" />
              <CardTitle>Maintenance Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Active Requests: 2</p>
                <Button className="w-full">Submit New Request</Button>
                <Button variant="outline" className="w-full">View History</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Calendar className="w-8 h-8 text-primary" />
              <CardTitle>Amenity Bookings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Your Upcoming Bookings</p>
                <div className="text-sm text-gray-600">
                  <p>Gym - Today, 6 PM</p>
                  <p>Pool - Tomorrow, 2 PM</p>
                </div>
                <Button className="w-full">Book Amenity</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <CreditCard className="w-8 h-8 text-primary" />
              <CardTitle>Payments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Next Payment Due</p>
                <p className="text-2xl font-bold text-primary">$1,500</p>
                <p className="text-sm text-gray-600">Due: May 1, 2024</p>
                <Button className="w-full mt-4">Make Payment</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Car className="w-8 h-8 text-primary" />
              <CardTitle>Parking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Your Spot: B2-45</p>
                <p className="text-sm text-gray-600">Visitor Passes: 2 Available</p>
                <Button className="w-full mt-2">Request Visitor Pass</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <FileText className="w-8 h-8 text-primary" />
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full">Building Rules</Button>
              <Button variant="outline" className="w-full">Lease Agreement</Button>
              <Button variant="outline" className="w-full">Community Guidelines</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <MessageSquare className="w-8 h-8 text-primary" />
              <CardTitle>Community Forum</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Join Discussion</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Users className="w-8 h-8 text-primary" />
              <CardTitle>Neighbors</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full">View Directory</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Phone className="w-8 h-8 text-primary" />
              <CardTitle>Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <p className="font-medium">Building Security</p>
                <p className="text-gray-600">123-456-7890</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Maintenance</p>
                <p className="text-gray-600">123-456-7891</p>
              </div>
            </CardContent>
          </Card>
            </div>

            <LocalServices />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ResidentDashboard;