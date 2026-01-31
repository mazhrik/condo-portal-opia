import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getMaintenanceRequests,
  MaintenancePriority,
  MaintenanceRequest,
  MaintenanceStatus,
} from "@/utils/api";
import { useMe } from "@/hooks/useMe";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const MaintenanceAll = () => {
  const { data: me, isLoading: isMeLoading } = useMe();
  const navigate = useNavigate();
  const isStaff = me?.role === "admin" || me?.role === "manager";
  const [status, setStatus] = useState<MaintenanceStatus | "all">("all");
  const [priority, setPriority] = useState<MaintenancePriority | "all">("all");
  const [assignedTo, setAssignedTo] = useState("");
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");
  const [query, setQuery] = useState("");

  const params = useMemo(
    () => ({
      status: status === "all" ? undefined : status,
      priority: priority === "all" ? undefined : priority,
      assigned_to: assignedTo ? Number(assignedTo) : undefined,
      created_from: createdFrom || undefined,
      created_to: createdTo || undefined,
      q: query || undefined,
    }),
    [assignedTo, createdFrom, createdTo, priority, query, status]
  );

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["maintenance:list:all", params],
    queryFn: () => getMaintenanceRequests(params),
    enabled: isStaff,
  });

  const requests = data?.results ?? [];

  const clearFilters = () => {
    setStatus("all");
    setPriority("all");
    setAssignedTo("");
    setCreatedFrom("");
    setCreatedTo("");
    setQuery("");
  };

  if (isMeLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!isStaff) {
    return (
      <Alert variant="destructive" className="border-white/10 bg-slate-950 text-white">
        <AlertTitle>Access denied</AlertTitle>
        <AlertDescription>
          You do not have permission to view all maintenance requests.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">All maintenance requests</h1>
          <p className="text-sm text-white/70">
            Monitor and manage maintenance requests across the property.
          </p>
        </div>
        <Button asChild>
          <Link to="/maintenance/new">Create request</Link>
        </Button>
      </div>

      <Card className="border-white/10 bg-slate-900/60 text-white">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm text-white/70" htmlFor="filter-status">
              Status
            </label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as MaintenanceStatus | "all")}
            >
              <SelectTrigger id="filter-status" className="bg-white/5 text-white">
                <SelectValue placeholder="Any status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_review">In review</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in_progress">In progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/70" htmlFor="filter-priority">
              Priority
            </label>
            <Select
              value={priority}
              onValueChange={(value) => setPriority(value as MaintenancePriority | "all")}
            >
              <SelectTrigger id="filter-priority" className="bg-white/5 text-white">
                <SelectValue placeholder="Any priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/70" htmlFor="filter-assigned">
              Assigned staff ID
            </label>
            <Input
              id="filter-assigned"
              type="number"
              value={assignedTo}
              onChange={(event) => setAssignedTo(event.target.value)}
              placeholder="e.g. 3"
              className="bg-white/5 text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/70" htmlFor="filter-created-from">
              Created from
            </label>
            <Input
              id="filter-created-from"
              type="date"
              value={createdFrom}
              onChange={(event) => setCreatedFrom(event.target.value)}
              className="bg-white/5 text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/70" htmlFor="filter-created-to">
              Created to
            </label>
            <Input
              id="filter-created-to"
              type="date"
              value={createdTo}
              onChange={(event) => setCreatedTo(event.target.value)}
              className="bg-white/5 text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/70" htmlFor="filter-query">
              Search
            </label>
            <Input
              id="filter-query"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title or description"
              className="bg-white/5 text-white"
            />
          </div>
          <div className="flex items-center gap-3 md:col-span-3">
            <Button variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
            <Button variant="secondary" onClick={() => refetch()}>
              Apply filters
            </Button>
          </div>
        </CardContent>
      </Card>

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
                <span>Try again to load maintenance requests.</span>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          ) : requests.length === 0 ? (
            <div className="rounded-md border border-dashed border-white/10 px-4 py-6 text-center text-white/60">
              No maintenance requests found.
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
                      <span className="text-white/50">Resident #{request.resident}</span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      navigate(`/maintenance/${request.id}`);
                    }}
                  >
                    Manage
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

export default MaintenanceAll;
