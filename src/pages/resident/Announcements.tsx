import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

const Announcements = () => {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Announcements</h1>
        <p className="text-gray-600">Stay updated with the latest community news</p>
      </header>

      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <Bell className="w-8 h-8 text-primary" />
            <CardTitle>Recent Announcements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-primary p-3 bg-primary-100">
              <p className="font-semibold">Building Maintenance</p>
              <p className="text-sm text-gray-600">Scheduled for next week</p>
              <p className="text-sm text-gray-500 mt-2">Posted: April 15, 2024</p>
            </div>
            <div className="border-l-4 border-primary p-3 bg-primary-100">
              <p className="font-semibold">Community Meeting</p>
              <p className="text-sm text-gray-600">This Saturday at 10 AM</p>
              <p className="text-sm text-gray-500 mt-2">Posted: April 14, 2024</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Announcements;