import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Loader2 } from "lucide-react";
import { getAnnouncements } from "@/utils/api";
import { format } from "date-fns";
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
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50 p-8">
      <div className="fixed inset-0 -z-10">
        <img
          src="/lovable-uploads/5f307eb2-750f-41ff-aeb3-659ec419eb29.png"
          alt="Modern interior"
          className="w-full h-full object-cover opacity-[0.03]"
        />
      </div>
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background to-background/50" />
      <div className="relative max-w-7xl mx-auto space-y-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">Announcements</h1>
          <p className="text-gray-400">Stay updated with the latest community news</p>
        </header>

        <div className="space-y-6">
          <Card className="glass">
            <CardHeader className="flex flex-row items-center space-x-4">
              <Bell className="w-8 h-8 text-amber-500" />
              <CardTitle className="text-white">Recent Announcements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                </div>
              ) : error ? (
                <p className="text-red-400">Failed to load announcements</p>
              ) : announcements?.length === 0 ? (
                <p className="text-gray-400">No announcements available.</p>
              ) : (
                announcements?.map((announcement: any) => (
                  <div key={announcement.id} className="border-l-4 border-amber-500 p-4 bg-white/5 rounded-r-lg">
                    <p className="font-semibold text-white">{announcement.title}</p>
                    <p className="text-sm text-gray-300 mt-2">{announcement.content}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Posted: {format(new Date(announcement.created_at), 'MMMM d, yyyy')}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Announcements;