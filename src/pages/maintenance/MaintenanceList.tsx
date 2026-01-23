import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMaintenanceRequests, MaintenanceRequest } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const statusTone = (status: MaintenanceRequest["status"]) => {
  switch (status) {
    case "new":
      return "bg-blue-500/10 text-blue-300";
    case "in_review":
      return "bg-amber-500/10 text-amber-300";
    case "assigned":
      return "bg-purple-500/10 text-purple-300";
    case "in_progress":
      return "bg-orange-500/10 text-orange-300";
    case "completed":
      return "bg-emerald-500/10 text-emerald-300";
    case "closed":
      return "bg-slate-500/10 text-slate-300";
    default:
      return "bg-slate-500/10 text-slate-300";
  }
};

const priorityTone = (priority: MaintenanceRequest["priority"]) => {
  switch (priority) {
    case "high":
      return "bg-red-500/10 text-red-300";
    case "medium":
      return "bg-amber-500/10 text-amber-300";
    case "low":
      return "bg-emerald-500/10 text-emerald-300";
    default:
      return "bg-slate-500/10 text-slate-300";
  }
};

const MaintenanceList = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["maintenance:list:mine"],
    queryFn: () => getMaintenanceRequests(),
  });

  const requests = data?.results ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">My maintenance requests</h1>
          <p className="text-sm text-white/70">
            Track the status of your submitted maintenance requests.
          </p>
        </div>
        <Button asChild>
          <Link to="/maintenance/new">Create request</Link>
        </Button>
      </div>

      <Card className="border-white/10 bg-slate-900/60 text-white">
        <CardHeader>
          <CardTitle className="text-lg">Requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : isError ? (
            <Alert variant="destructive" className="border-white/10 bg-slate-950 text-white">
              <AlertTitle>Unable to load requests</AlertTitle>
              <AlertDescription className="flex items-center justify-between gap-4">
                <span>Try again to load your maintenance requests.</span>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          ) : requests.length === 0 ? (
            <div className="rounded-md border border-dashed border-white/10 px-4 py-6 text-center text-white/60">
              No requests yet. Create a new maintenance request to get started.
            </div>
          ) : (
            requests.map((request) => (
              <Card
                key={request.id}
                className="border-white/10 bg-slate-950/40 text-white"
              >
                <CardContent className="flex flex-col gap-3 py-5 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <Link
                      to={`/maintenance/${request.id}`}
                      className="text-lg font-semibold hover:underline"
                    >
                      {request.title}
                    </Link>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <Badge className={statusTone(request.status)}>{request.status}</Badge>
                      <Badge className={priorityTone(request.priority)}>{request.priority}</Badge>
                      <span className="text-white/50">
                        Updated {new Date(request.updated_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" asChild>
                    <Link to={`/maintenance/${request.id}`}>View details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceList;
