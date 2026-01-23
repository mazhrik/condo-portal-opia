import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Announcement,
  createAnnouncement,
  getAnnouncements,
  updateAnnouncement,
} from "@/utils/api";
import { useMe } from "@/hooks/useMe";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const getErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: any } }).response;
    return (
      response?.data?.error?.message ||
      response?.data?.detail ||
      "Something went wrong."
    );
  }
  return "Something went wrong.";
};

const Announcements = () => {
  const { data: me } = useMe();
  const queryClient = useQueryClient();
  const canManage = me?.role === "admin" || me?.role === "manager";

  const [showInactive, setShowInactive] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const isActiveFilter = canManage ? !showInactive : true;

  const {
    data: announcementData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["announcements:list", isActiveFilter],
    queryFn: () => getAnnouncements({ is_active: isActiveFilter }),
  });

  const announcements = announcementData?.results ?? [];

  const createMutation = useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      toast.success("Announcement created.");
      setDraftTitle("");
      setDraftContent("");
      queryClient.invalidateQueries({ queryKey: ["announcements:list"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard:summary"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<Pick<Announcement, "title" | "content" | "is_active">>;
    }) => updateAnnouncement(id, data),
    onSuccess: () => {
      toast.success("Announcement updated.");
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ["announcements:list"] });
      queryClient.invalidateQueries({ queryKey: ["announcements:detail"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard:summary"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleEditStart = (announcement: Announcement) => {
    setEditingId(announcement.id);
    setEditTitle(announcement.title);
    setEditContent(announcement.content);
  };

  const handleEditSave = (announcementId: number) => {
    updateMutation.mutate({
      id: announcementId,
      data: { title: editTitle, content: editContent },
    });
  };

  const handleToggleActive = (announcement: Announcement) => {
    updateMutation.mutate({
      id: announcement.id,
      data: { is_active: !announcement.is_active },
    });
  };

  const canSubmitDraft = useMemo(
    () => draftTitle.trim().length > 0 && draftContent.trim().length > 0,
    [draftTitle, draftContent]
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Announcements</h1>
          <p className="text-sm text-white/70">
            Stay up to date with community updates and notices.
          </p>
        </div>
        {canManage ? (
          <Button
            variant="outline"
            onClick={() => setShowInactive((prev) => !prev)}
          >
            {showInactive ? "Show active" : "Show inactive"}
          </Button>
        ) : null}
      </div>

      {canManage ? (
        <Card className="border-white/10 bg-slate-900/60 text-white">
          <CardHeader>
            <CardTitle className="text-lg">Create announcement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              placeholder="Title"
              className="bg-white/5 text-white"
            />
            <Textarea
              value={draftContent}
              onChange={(event) => setDraftContent(event.target.value)}
              placeholder="Write the announcement details..."
              className="min-h-[120px] bg-white/5 text-white"
            />
            <div className="flex justify-end">
              <Button
                onClick={() =>
                  createMutation.mutate({
                    title: draftTitle.trim(),
                    content: draftContent.trim(),
                  })
                }
                disabled={!canSubmitDraft || isSaving}
              >
                Create announcement
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card className="border-white/10 bg-slate-900/60 text-white">
        <CardHeader>
          <CardTitle className="text-lg">
            {showInactive && canManage ? "Inactive announcements" : "Active announcements"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : isError ? (
            <Alert variant="destructive" className="border-white/10 bg-slate-950 text-white">
              <AlertTitle>Unable to load announcements</AlertTitle>
              <AlertDescription className="flex items-center justify-between gap-4">
                <span>Try again to fetch the latest announcements.</span>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          ) : announcements.length === 0 ? (
            <div className="rounded-md border border-dashed border-white/10 px-4 py-6 text-center text-white/60">
              No announcements available.
            </div>
          ) : (
            announcements.map((announcement) => {
              const isEditing = editingId === announcement.id;
              return (
                <Card
                  key={announcement.id}
                  data-announcement-id={announcement.id}
                  data-announcement-title={announcement.title}
                  className="border-white/10 bg-slate-950/40 text-white"
                >
                  <CardHeader className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        {isEditing ? (
                          <Input
                            value={editTitle}
                            onChange={(event) => setEditTitle(event.target.value)}
                            className="bg-white/5 text-white"
                          />
                        ) : (
                          <CardTitle className="text-lg">
                            <Link
                              to={`/announcements/${announcement.id}`}
                              className="hover:underline"
                            >
                              {announcement.title}
                            </Link>
                          </CardTitle>
                        )}
                        <div className="text-xs text-white/50">
                          {new Date(announcement.created_at).toLocaleString()}
                        </div>
                      </div>
                      <Badge variant={announcement.is_active ? "default" : "secondary"}>
                        {announcement.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditing ? (
                      <Textarea
                        value={editContent}
                        onChange={(event) => setEditContent(event.target.value)}
                        className="min-h-[120px] bg-white/5 text-white"
                      />
                    ) : (
                      <p className="text-sm text-white/70 whitespace-pre-line">
                        {announcement.content}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/announcements/${announcement.id}`}>View details</Link>
                      </Button>
                      {canManage ? (
                        <>
                          {isEditing ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleEditSave(announcement.id)}
                                disabled={isSaving}
                              >
                                Save
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingId(null)}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditStart(announcement)}
                            >
                              Edit
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(announcement)}
                            disabled={isSaving}
                          >
                            {announcement.is_active ? "Deactivate" : "Reactivate"}
                          </Button>
                        </>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Announcements;
