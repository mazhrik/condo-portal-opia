import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useMe } from "@/hooks/useMe";
import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "@/utils/api";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { data: me } = useMe();
  const {
    data: summary,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["dashboard:summary"],
    queryFn: getDashboardSummary,
  });

  const latestAnnouncements = summary?.announcements.latest ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">
          Welcome back{me?.first_name ? `, ${me.first_name}` : ""}
        </h1>
        <p className="mt-2 text-white/70">
          Your condo portal is ready. This is the Phase 0 landing area where upcoming
          modules will appear.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-white/10 bg-slate-900/60 text-white">
          <CardHeader>
            <CardTitle className="text-lg">Account status</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-white/70">
            {me ? (
              <>
                Signed in as {me.email}. Role:{" "}
                <span className="font-semibold text-white">{me.role}</span>.
              </>
            ) : (
              "Connected to the condo portal. Loading profile..."
            )}
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-slate-900/60 text-white">
          <CardHeader>
            <CardTitle className="text-lg">Active announcements</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-white/70">
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : isError ? (
              <Alert variant="destructive" className="border-white/10 bg-slate-950 text-white">
                <AlertTitle>Unable to load summary</AlertTitle>
                <AlertDescription className="flex items-center justify-between gap-4">
                  <span>Try again to load dashboard widgets.</span>
                  <Button variant="outline" size="sm" onClick={() => refetch()}>
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-white">
                  {summary?.announcements.active_count ?? 0}
                </span>
                <span>active</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Card className="border-white/10 bg-slate-900/60 text-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Latest announcements</CardTitle>
          <Button variant="outline" asChild>
            <Link to="/announcements">View all</Link>
          </Button>
        </CardHeader>
        <CardContent className="text-sm text-white/70">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : isError ? (
            <Alert variant="destructive" className="border-white/10 bg-slate-950 text-white">
              <AlertTitle>Unable to load announcements</AlertTitle>
              <AlertDescription className="flex items-center justify-between gap-4">
                <span>Check the connection and try again.</span>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          ) : latestAnnouncements.length === 0 ? (
            <div className="rounded-md border border-dashed border-white/10 px-4 py-6 text-center text-white/60">
              No announcements yet.
            </div>
          ) : (
            <ul className="space-y-3">
              {latestAnnouncements.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-4">
                  <div>
                    <Link
                      to={`/announcements/${item.id}`}
                      className="text-white hover:underline"
                    >
                      {item.title}
                    </Link>
                    <div className="text-xs text-white/50">
                      {new Date(item.created_at).toLocaleString()}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/announcements/${item.id}`}>Open</Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
