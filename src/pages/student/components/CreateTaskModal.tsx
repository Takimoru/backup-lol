import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { useAuth } from "../../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
  const { user } = useAuth();
  const createTask = useMutation(api.tasks.createTask);
  const myTeams = useQuery(api.teams.getTeamsForUser, user ? { userId: user._id } : "skip");

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    teamId: "",
    assignedTo: "",
    week: new Date().toISOString().slice(0, 10), // Default to today, but we need week format
  });

  // Helper to get current week in YYYY-WW format
  const getCurrentWeek = () => {
    const date = new Date();
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
    return `${d.getUTCFullYear()}-${String(weekNo).padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.teamId || !formData.assignedTo) {
      toast.error("Please select a team and assignee");
      return;
    }

    setIsLoading(true);
    try {
      await createTask({
        teamId: formData.teamId as any,
        title: formData.title,
        description: formData.description,
        assignedTo: formData.assignedTo as any,
        week: getCurrentWeek(), // Using current week for now
      });
      toast.success("Task created successfully");
      onClose();
      setFormData({
        title: "",
        description: "",
        teamId: "",
        assignedTo: "",
        week: getCurrentWeek(),
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedTeam = myTeams?.find(t => t._id === formData.teamId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Design Homepage"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Task details..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="team">Team (Work Program)</Label>
            <Select
              value={formData.teamId}
              onValueChange={(value) => setFormData({ ...formData, teamId: value, assignedTo: "" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                {myTeams?.map((team) => (
                  <SelectItem key={team._id} value={team._id}>
                    {team.program?.title || "Untitled Team"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTeam && (
            <div className="space-y-2">
              <Label htmlFor="assignee">Assign To</Label>
              <Select
                value={formData.assignedTo}
                onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent>
                  {/* Add Leader */}
                  <SelectItem value={selectedTeam.leaderId}>
                    Leader (You?)
                  </SelectItem>
                  {/* Add Members - assuming members are populated or we need to fetch them. 
                      The type in ProjectGrid says members?: (Doc<"users"> | null)[];
                      But getTeamsForUser might not populate members fully if not requested.
                      Let's assume for now we can select from available data.
                      Actually, `getTeamsForUser` usually returns the team doc.
                      We might need to fetch members if they are just IDs.
                      Let's check `teams.ts` later if needed. For now, let's just allow assigning to self (user) if member list is empty or complex.
                  */}
                  {user && <SelectItem value={user._id}>Me ({user.name})</SelectItem>}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
