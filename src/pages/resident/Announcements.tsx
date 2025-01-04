import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { getAnnouncements } from "@/utils/api";
import { format } from "date-fns";

const Announcements = () => {
  const { data: announcements, isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: getAnnouncements,
  });

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
            {isLoading ? (
              <p>Loading announcements...</p>
            ) : announcements?.length === 0 ? (
              <p>No announcements available.</p>
            ) : (
              announcements?.map((announcement) => (
                <div key={announcement.id} className="border-l-4 border-primary p-3 bg-primary-100">
                  <p className="font-semibold">{announcement.title}</p>
                  <p className="text-sm text-gray-600">{announcement.content}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Posted: {format(new Date(announcement.created_at), 'MMMM d, yyyy')}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Announcements;