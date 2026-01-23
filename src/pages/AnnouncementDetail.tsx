import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAnnouncement } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AnnouncementDetail = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: announcement,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["announcements:detail", id],
    queryFn: () => getAnnouncement(id ?? ""),
    enabled: Boolean(id),
  });

  if (!id) {
    return (
      <Alert variant="destructive" className="border-white/10 bg-slate-950 text-white">
        <AlertTitle>Invalid announcement</AlertTitle>
        <AlertDescription>
          The announcement ID is missing. Return to the announcements list.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" asChild>
        <Link to="/announcements">Back to announcements</Link>
      </Button>

      <Card className="border-white/10 bg-slate-900/60 text-white">
        <CardHeader className="space-y-3">
          {isLoading ? (
            <Skeleton className="h-8 w-3/4" />
          ) : isError || !announcement ? (
            <Alert variant="destructive" className="border-white/10 bg-slate-950 text-white">
              <AlertTitle>Unable to load announcement</AlertTitle>
              <AlertDescription className="flex items-center justify-between gap-4">
                <span>Try again to load the announcement details.</span>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="text-2xl">{announcement.title}</CardTitle>
                <Badge variant={announcement.is_active ? "default" : "secondary"}>
                  {announcement.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="text-xs text-white/50">
                Created {new Date(announcement.created_at).toLocaleString()}
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : announcement ? (
            <p className="text-sm text-white/80 whitespace-pre-line">
              {announcement.content}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnnouncementDetail;
