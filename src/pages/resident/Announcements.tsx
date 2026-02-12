import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Loader2 } from "lucide-react";
import { ResidentLayout } from "@/components/resident/ResidentLayout";
import { getAnnouncements } from "@/utils/api";
import { formatToUserTimezone } from "@/utils/date";
import { useToast } from "@/hooks/use-toast";

const Announcements = () => {
  const { toast } = useToast();
  const { data: announcements, isLoading, error } = useQuery({
    queryKey: ['announcements'],
    queryFn: getAnnouncements,
    meta: {
      onError: (error: Error) => {
        console.error("Error fetching announcements:", error);
        toast({
          title: "Error",
          description: "Failed to load announcements. Please try again later.",
          variant: "destructive",
        });
      }
    }
  });

  return (
    <ResidentLayout>
      <div className="p-8 relative">
        <div className="max-w-7xl mx-auto space-y-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-primary">Announcements</h1>
            <p className="text-gray-600">Stay updated with the latest community news</p>
          </header>

          <div className="space-y-6">
            <Card className="glass">
              <CardHeader className="flex flex-row items-center space-x-4">
                <Bell className="w-8 h-8 text-amber-500" />
                <CardTitle className="text-primary">Recent Announcements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                  </div>
                ) : error ? (
                  <p className="text-red-600">Failed to load announcements</p>
                ) : announcements?.results.length === 0 ? (
                  <p className="text-gray-600">No announcements available.</p>
                ) : (
                  announcements?.results.map((announcement: any) => (
                    <div key={announcement.id} className="border-l-4 border-amber-500 p-4 bg-white/5 rounded-r-lg">
                      <p className="font-semibold text-primary">{announcement.title}</p>
                      <p className="text-sm text-gray-700 mt-2">{announcement.content}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Posted: {formatToUserTimezone(announcement.created_at)}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ResidentLayout>
  );
};

export default Announcements;
