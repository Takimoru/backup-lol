import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Separator } from "../../../components/ui/separator";
import { Badge } from "../../../components/ui/badge";
import { Loader2, Send } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "../../../contexts/AuthContext";
import { toast } from "react-hot-toast";

interface TaskDetailModalProps {
  taskId: Id<"tasks"> | null;
  onClose: () => void;
}

export function TaskDetailModal({ taskId, onClose }: TaskDetailModalProps) {
  const { user } = useAuth();
  const [note, setNote] = useState("");
  const [progress, setProgress] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch task details (we might need a specific query or use getById if available, 
  // currently we don't have a direct getTaskById exposed in tasks.ts, but we can use getUpdates and maybe pass task data from parent or add a query)
  // Let's assume we pass task data or add a query. For now, let's add a query to tasks.ts or use a simple get.
  // Actually, we can use `api.tasks.getUpdates` to get updates, but we need task info too.
  // Let's add `getById` to `convex/tasks.ts` later. For now, let's assume we have it or use what we have.
  // I'll add `getById` to `convex/tasks.ts` in the next step.
  
  const taskUpdates = useQuery(api.tasks.getUpdates, taskId ? { taskId } : "skip");
  const addUpdate = useMutation(api.tasks.addUpdate);

  // Placeholder for task data fetching. 
  // Ideally we should fetch the task here to show title/desc if not passed as prop.
  // For now, I'll assume the parent passes the task object or I'll implement getById.
  // Let's implement getById in tasks.ts first.

  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskId || !user) return;
    if (!note && progress === "") return;

    setIsSubmitting(true);
    try {
      await addUpdate({
        taskId,
        memberId: user._id,
        notes: note,
        progress: progress === "" ? undefined : Number(progress),
        // attachments: [] // TODO: Implement file upload
      });
      setNote("");
      setProgress("");
      toast.success("Update added");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add update");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!taskId) return null;

  return (
    <Dialog open={!!taskId} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Task Updates</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6">
              {/* History */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Activity History</h3>
                {taskUpdates?.map((update) => (
                  <div key={update._id} className="flex gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="font-semibold text-primary text-xs">
                        {update.user?.name?.[0] || "?"}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{update.user?.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(update.updatedAt), "MMM d, h:mm a")}
                        </span>
                      </div>
                      {update.notes && <p className="text-foreground/90">{update.notes}</p>}
                      {update.progress !== undefined && (
                        <Badge variant="secondary" className="mt-1">
                          Progress: {update.progress}%
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {taskUpdates?.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">No updates yet.</p>
                )}
              </div>
            </div>
          </ScrollArea>

          <Separator className="my-4" />

          {/* Input Area */}
          <form onSubmit={handleSubmitUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="note">Add Update</Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Type your update here..."
                className="min-h-[80px]"
              />
            </div>
            
            <div className="flex items-end gap-4">
              <div className="space-y-2 w-32">
                <Label htmlFor="progress">Progress (%)</Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="Optional"
                />
              </div>
              <div className="flex-1 flex justify-end">
                <Button type="submit" disabled={isSubmitting || (!note && progress === "")}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  Post Update
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
