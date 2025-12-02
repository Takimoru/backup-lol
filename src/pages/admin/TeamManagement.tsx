import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  Users,
  Plus,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { Id, Doc } from "../../../convex/_generated/dataModel";
import { AdminPageLayout } from "./components/AdminPageLayout";
import { AdminHeader } from "./components/AdminHeader";
import { TeamList } from "./components/teams/TeamList";
import { ManageTeamModal } from "./components/teams/ManageTeamModal";
import { TeamAttendanceModal } from "./components/teams/TeamAttendanceModal";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { EnrichedTeam, TeamForm } from "./types/team";

// Helper types and functions
// None needed locally for now

export function TeamManagement() {
  const { user } = useAuth();
  const [selectedProgram, setSelectedProgram] = useState<Id<"programs"> | null>(
    null
  );
  
  // Modal states
  const [isManageTeamOpen, setIsManageTeamOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<EnrichedTeam | null>(null);
  const [viewingAttendanceTeam, setViewingAttendanceTeam] = useState<EnrichedTeam | null>(null);

  const [newTeamForm, setNewTeamForm] = useState<TeamForm>({
    name: "",
    leaderId: "",
    memberIds: [],
  });

  // Queries
  const programs = useQuery(api.programs.getAllPrograms, {
    includeArchived: false,
  }) as Doc<"programs">[] | undefined;

  const teamsForProgram = useQuery(
    api.teams.getTeamsByProgram,
    selectedProgram ? { programId: selectedProgram } : "skip"
  ) as EnrichedTeam[] | undefined;

  const createTeam = useMutation(api.teams.createTeam);
  const deleteTeam = useMutation(api.teams.deleteTeam);
  
  const allUsers = useQuery(api.users.getAllUsers, {}) as Doc<"users">[] | undefined;
  
  // Derived state
  const studentOptions = useMemo(() => {
    return allUsers?.filter((u) => u.role === "student") ?? [];
  }, [allUsers]);

  const availableStudents = useMemo(() => {
    const studentsInProgramTeams = new Set<string>();
    if (teamsForProgram) {
      teamsForProgram.forEach((team) => {
        if (editingTeam && team._id === editingTeam._id) return;

        const leaderId = team.leaderId || (team.leader?._id as string);
        if (leaderId) studentsInProgramTeams.add(leaderId);
        
        if (team.memberIds) {
          team.memberIds.forEach((id) => studentsInProgramTeams.add(id));
        }
        if (team.members) {
          team.members.forEach((m) => {
            if (m?._id) studentsInProgramTeams.add(m._id);
          });
        }
      });
    }

    return studentOptions.filter((u) => !studentsInProgramTeams.has(u._id));
  }, [studentOptions, teamsForProgram, editingTeam]);

  // Handlers
  const handleCreateClick = () => {
    setEditingTeam(null);
    setNewTeamForm({
      name: "",
      leaderId: "",
      memberIds: [],
    });
    setIsManageTeamOpen(true);
  };

  const handleEditClick = (team: EnrichedTeam) => {
    setEditingTeam(team);
    setNewTeamForm({
      name: team.name || "",
      leaderId: team.leader?._id || "",
      memberIds: team.members?.map(m => m?._id).filter(Boolean) as string[] || [],
    });
    setIsManageTeamOpen(true);
  };

  const handleSubmitTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgram || !user) return;

    try {
      if (editingTeam) {
        toast.error("Update team not implemented yet");
      } else {
        await createTeam({
          programId: selectedProgram,
          leaderId: newTeamForm.leaderId as Id<"users">,
          memberIds: newTeamForm.memberIds as Id<"users">[],
          name: newTeamForm.name,
          adminId: user._id,
        });
        toast.success("Team created successfully");
      }
      setIsManageTeamOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to save team");
    }
  };

  const handleDeleteClick = async (teamId: Id<"teams">) => {
    if (!user) return;
    if (window.confirm("Are you sure you want to delete this team?")) {
      try {
        await deleteTeam({ id: teamId, adminId: user._id });
        toast.success("Team deleted");
      } catch (error: any) {
        toast.error("Failed to delete team");
      }
    }
  };

  // Render
  const selectedProgramData = programs?.find(p => p._id === selectedProgram);

  return (
    <AdminPageLayout>
      <AdminHeader
        title={selectedProgram ? `Teams: ${selectedProgramData?.title}` : "Team Management"}
        description={selectedProgram ? "Manage teams for this program" : "Select a program to manage teams"}
        action={
          selectedProgram ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSelectedProgram(null)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Programs
              </Button>
              <Button onClick={handleCreateClick}>
                <Plus className="w-4 h-4 mr-2" />
                Create Team
              </Button>
            </div>
          ) : null
        }
      />

      {!selectedProgram ? (
        // Program List View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs?.map((program) => (
            <Card key={program._id} className="hover:shadow-lg hover:shadow-blue-100 transition-all border-blue-100/50 hover:border-blue-300 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50/50 to-transparent">
                <CardTitle className="text-blue-950">{program.title}</CardTitle>
                <CardDescription className="line-clamp-2 text-blue-900/60">
                  {program.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-sm text-blue-900/70 space-y-1">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                    <span>
                      {format(new Date(program.startDate), "MMM d, yyyy")} -{" "}
                      {format(new Date(program.endDate), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-blue-50/30">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 shadow-md" 
                  onClick={() => setSelectedProgram(program._id)}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Manage Teams
                </Button>
              </CardFooter>
            </Card>
          ))}
          {programs?.length === 0 && (
            <div className="col-span-full text-center py-12 text-blue-900/50 bg-blue-50/30 rounded-xl border border-blue-100 border-dashed">
              No programs found.
            </div>
          )}
        </div>
      ) : (
        // Team List View
        <TeamList
          teams={teamsForProgram || []}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onViewAttendance={setViewingAttendanceTeam}
        />
      )}

      {/* Modals */}
      {isManageTeamOpen && (
        <ManageTeamModal
          formData={newTeamForm}
          isEditing={!!editingTeam}
          availableStudents={availableStudents}
          onChange={setNewTeamForm}
          onSubmit={handleSubmitTeam}
          onClose={() => setIsManageTeamOpen(false)}
        />
      )}

      {viewingAttendanceTeam && (
        <TeamAttendanceModal
          team={viewingAttendanceTeam}
          onClose={() => setViewingAttendanceTeam(null)}
        />
      )}
    </AdminPageLayout>
  );
}
