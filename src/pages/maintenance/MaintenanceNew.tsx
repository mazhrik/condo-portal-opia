import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createMaintenanceRequest,
  MaintenancePriority,
} from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MaintenanceNew = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<MaintenancePriority>("medium");

  const createMutation = useMutation({
    mutationFn: createMaintenanceRequest,
    onSuccess: () => {
      toast.success("Maintenance request submitted.");
      queryClient.invalidateQueries({ queryKey: ["maintenance:list:mine"] });
      navigate("/maintenance");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error?.message ||
        error?.response?.data?.detail ||
        "Unable to submit request.";
      toast.error(message);
    },
  });

  const canSubmit = title.trim().length > 0 && description.trim().length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Create maintenance request</h1>
        <p className="text-sm text-white/70">
          Provide a brief description so the team can respond quickly.
        </p>
      </div>

      <Card className="border-white/10 bg-slate-900/60 text-white">
        <CardHeader>
          <CardTitle className="text-lg">Request details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-white/70" htmlFor="title">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Leaky faucet"
              className="bg-white/5 text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/70" htmlFor="description">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Share details about the issue and location."
              className="min-h-[140px] bg-white/5 text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/70" htmlFor="priority">
              Priority
            </label>
            <Select
              value={priority}
              onValueChange={(value) => setPriority(value as MaintenancePriority)}
            >
              <SelectTrigger id="priority" className="bg-white/5 text-white">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/maintenance")}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                createMutation.mutate({
                  title: title.trim(),
                  description: description.trim(),
                  priority,
                })
              }
              disabled={!canSubmit || createMutation.isPending}
            >
              {createMutation.isPending ? "Submitting..." : "Submit request"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceNew;
