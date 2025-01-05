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
    onError: (error) => {
      console.error("Error fetching announcements:", error);
      toast({
        title: "Error",
        description: "Failed to load announcements. Please try again later.",
        variant: "destructive",
      });
    }
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
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <p className="text-destructive">Failed to load announcements</p>
            ) : announcements?.length === 0 ? (
              <p className="text-muted-foreground">No announcements available.</p>
            ) : (
              announcements?.map((announcement: any) => (
                <div key={announcement.id} className="border-l-4 border-primary p-4 bg-primary/5 rounded-r-lg">
                  <p className="font-semibold">{announcement.title}</p>
                  <p className="text-sm text-muted-foreground mt-2">{announcement.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">
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