import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getMaintenanceRequest,
  MaintenanceRequest,
  MaintenanceStatus,
  updateMaintenanceRequest,
} from "@/utils/api";
import { useMe } from "@/hooks/useMe";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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

const STATUS_FLOW: Record<MaintenanceStatus, MaintenanceStatus[]> = {
  new: ["in_review"],
  in_review: ["assigned"],
  assigned: ["in_progress"],
  in_progress: ["completed"],
  completed: ["closed"],
  closed: [],
};

const getAllowedStatuses = (
  current: MaintenanceStatus,
  isAdmin: boolean
) => {
  const next = STATUS_FLOW[current] ?? [];
  const allowClose = isAdmin && current !== "closed" ? ["closed"] : [];
  const options = [current, ...next, ...allowClose];
  return Array.from(new Set(options));
};

const MaintenanceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data: me } = useMe();
  const isStaff =
    me?.role === "admin" || me?.role === "manager" || Boolean(me?.staff);
  const isAdmin = me?.role === "admin";

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["maintenance:detail", id],
    queryFn: () => getMaintenanceRequest(id ?? ""),
    enabled: Boolean(id),
  });

  const request = data ?? null;

  const [status, setStatus] = useState<MaintenanceStatus | "">("");
  const [assignedTo, setAssignedTo] = useState("");
  const [completionNotes, setCompletionNotes] = useState("");

  const resetFields = (current?: MaintenanceRequest) => {
    if (!current) return;
    setStatus(current.status);
    setAssignedTo(current.assigned_to ? String(current.assigned_to) : "");
    setCompletionNotes(current.completion_notes ?? "");
  };

  const updateMutation = useMutation({
    mutationFn: (payload: {
      status?: MaintenanceStatus;
      assigned_to?: number | null;
      completion_notes?: string | null;
    }) => updateMaintenanceRequest(id ?? "", payload),
    onSuccess: (updated) => {
      toast.success("Request updated.");
      queryClient.invalidateQueries({ queryKey: ["maintenance:detail", id] });
      queryClient.invalidateQueries({ queryKey: ["maintenance:list:mine"] });
      queryClient.invalidateQueries({ queryKey: ["maintenance:list:all"] });
      resetFields(updated);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error?.message ||
        error?.response?.data?.detail ||
        "Unable to update request.";
      toast.error(message);
    },
  });

  const allowedStatuses = useMemo(() => {
    if (!request) return [];
    return getAllowedStatuses(request.status, isAdmin);
  }, [isAdmin, request]);

  useEffect(() => {
    resetFields(request ?? undefined);
  }, [request]);

  const completionRequired =
    (status || request?.status) === "completed" && completionNotes.trim().length === 0;

  const hasChanges = Boolean(
    request &&
      (status !== request.status ||
        assignedTo !== String(request.assigned_to ?? "") ||
        completionNotes.trim() !== (request.completion_notes ?? ""))
  );

  const canUpdate = Boolean(request) && !completionRequired && hasChanges;

  const handleUpdate = () => {
    if (!request) return;
    const payload: {
      status?: MaintenanceStatus;
      assigned_to?: number | null;
      completion_notes?: string | null;
    } = {};

    if (status && status !== request.status) {
      payload.status = status;
    }

    if (assignedTo !== String(request.assigned_to ?? "")) {
      payload.assigned_to = assignedTo ? Number(assignedTo) : null;
    }

    if ((request.completion_notes ?? "") !== completionNotes.trim()) {
      payload.completion_notes = completionNotes.trim() || null;
    }

    updateMutation.mutate(payload);
  };

  if (!id) {
    return (
      <Alert variant="destructive" className="border-white/10 bg-slate-950 text-white">
        <AlertTitle>Invalid request</AlertTitle>
        <AlertDescription>
          The maintenance request ID is missing.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" asChild>
        <Link to={isStaff ? "/maintenance/all" : "/maintenance"}>Back to requests</Link>
      </Button>

      <Card className="border-white/10 bg-slate-900/60 text-white">
        <CardHeader className="space-y-3">
          {isLoading ? (
            <Skeleton className="h-8 w-3/4" />
          ) : isError || !request ? (
            <Alert variant="destructive" className="border-white/10 bg-slate-950 text-white">
              <AlertTitle>Unable to load request</AlertTitle>
              <AlertDescription className="flex items-center justify-between gap-4">
                <span>Check permissions or try again.</span>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-2">
              <CardTitle className="text-2xl">{request.title}</CardTitle>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Badge className={statusTone(request.status)}>{request.status}</Badge>
                <Badge className={priorityTone(request.priority)}>{request.priority}</Badge>
                <span className="text-white/50">
                  Created {new Date(request.created_at).toLocaleString()}
                </span>
                <span className="text-white/50">
                  Updated {new Date(request.updated_at).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : request ? (
            <>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white/80">Description</h3>
                <p className="text-sm text-white/70 whitespace-pre-line">
                  {request.description}
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-md border border-white/10 bg-slate-950/40 p-4">
                  <p className="text-xs text-white/50">Assigned staff</p>
                  <p className="text-sm">
                    {request.assigned_to ? `Staff #${request.assigned_to}` : "Unassigned"}
                  </p>
                </div>
                <div className="rounded-md border border-white/10 bg-slate-950/40 p-4">
                  <p className="text-xs text-white/50">Completion notes</p>
                  <p className="text-sm">
                    {request.completion_notes ? request.completion_notes : "Not provided"}
                  </p>
                </div>
                <div className="rounded-md border border-white/10 bg-slate-950/40 p-4">
                  <p className="text-xs text-white/50">Status history</p>
                  <p className="text-sm text-white/70">History tracking coming soon.</p>
                </div>
              </div>

              {isStaff ? (
                <Card className="border-white/10 bg-slate-950/40 text-white">
                  <CardHeader>
                    <CardTitle className="text-lg">Manage request</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-white/70" htmlFor="manage-status">
                        Status
                      </label>
                      <Select
                        value={status || request.status}
                        onValueChange={(value) => setStatus(value as MaintenanceStatus)}
                      >
                        <SelectTrigger id="manage-status" className="bg-white/5 text-white">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {allowedStatuses.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {completionRequired ? (
                        <p className="text-xs text-red-300">
                          Completion notes are required when marking completed.
                        </p>
                      ) : null}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-white/70" htmlFor="manage-assigned-to">
                        Assign staff ID
                      </label>
                      <Input
                        id="manage-assigned-to"
                        type="number"
                        value={assignedTo}
                        onChange={(event) => setAssignedTo(event.target.value)}
                        placeholder="Enter staff ID"
                        className="bg-white/5 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-white/70" htmlFor="manage-completion">
                        Completion notes
                      </label>
                      <Textarea
                        id="manage-completion"
                        value={completionNotes}
                        onChange={(event) => setCompletionNotes(event.target.value)}
                        placeholder="Add completion notes (required for completed status)"
                        className="min-h-[120px] bg-white/5 text-white"
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => resetFields(request)}>
                        Reset
                      </Button>
                      <Button onClick={handleUpdate} disabled={!canUpdate || updateMutation.isPending}>
                        {updateMutation.isPending ? "Updating..." : "Update request"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceDetail;
