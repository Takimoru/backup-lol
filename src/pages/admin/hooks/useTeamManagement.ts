import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import toast from "react-hot-toast";
import { TeamForm, EnrichedTeam } from "../types/team";
import { useAuth } from "../../../contexts/AuthContext";

export function useTeamManagement() {
  const { user } = useAuth();
  const [selectedProgram, setSelectedProgram] = useState<Id<"programs"> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTeam, setEditingTeam] = useState<EnrichedTeam | null>(null);
  const [viewingAttendanceTeam, setViewingAttendanceTeam] = useState<EnrichedTeam | null>(null);
  const [formData, setFormData] = useState<TeamForm>({
    name: "",
    leaderId: "",
    memberIds: [],
    supervisorId: undefined,
  });

  const programs = useQuery(api.programs.getAllPrograms, {
    includeArchived: false,
  });

  const teams = useQuery(
    api.teams.getTeamsByProgram,
    selectedProgram ? { programId: selectedProgram } : "skip"
  );

  const students = useQuery(api.users.getStudentsByProgram, 
    selectedProgram ? { programId: selectedProgram } : "skip"
  );

  const supervisors = useQuery(api.users.getAllUsers, { role: "supervisor" });

  const createTeamMutation = useMutation(api.teams.createTeam);
  const updateTeamMutation = useMutation(api.teams.updateTeam);
  const deleteTeamMutation = useMutation(api.teams.deleteTeam);

  // Filter students who are not already in a team (unless they are in the team being edited)
  const availableStudents = useMemo(() => {
    if (!students || !teams) return [];
    
    // Get all students currently assigned to teams in this program
    const assignedStudentIds = new Set<string>();
    teams.forEach(team => {
      // Skip the current team if we're editing
      if (editingTeam && team._id === editingTeam._id) return;
      
      if (team.leaderId) assignedStudentIds.add(team.leaderId);
      if (team.memberIds) team.memberIds.forEach(id => assignedStudentIds.add(id));
    });

    // Filter out students who are already assigned
    return students.filter(student => !assignedStudentIds.has(student._id));
  }, [students, teams, editingTeam]);

  const resetForm = () => {
    setFormData({ name: "", leaderId: "", memberIds: [], supervisorId: undefined });
    setIsCreating(false);
    setEditingTeam(null);
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgram) return;
    if (!user?._id) {
      toast.error("You must be logged in as admin");
      return;
    }

    try {
      if (formData.memberIds.length < 1) {
        toast.error("A team must have at least 1 member");
        return;
      }

      await createTeamMutation({
        programId: selectedProgram,
        name: formData.name,
        leaderId: formData.leaderId as Id<"users">,
        memberIds: formData.memberIds as Id<"users">[],
        supervisorId: formData.supervisorId as Id<"users"> | undefined,
        adminId: user._id,
      });
      toast.success("Team created successfully");
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to create team");
    }
  };

  const handleUpdateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeam) return;
    if (!user?._id) {
      toast.error("You must be logged in as admin");
      return;
    }

    try {
      await updateTeamMutation({
        id: editingTeam._id,
        name: formData.name,
        leaderId: formData.leaderId as Id<"users">,
        memberIds: formData.memberIds as Id<"users">[],
        supervisorId: formData.supervisorId as Id<"users"> | undefined,
        adminId: user._id,
      });
      toast.success("Team updated successfully");
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to update team");
    }
  };

  const handleDeleteTeam = async (id: Id<"teams">) => {
    if (!user?._id) {
      toast.error("You must be logged in as admin");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to delete this team? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteTeamMutation({ 
        id,
        adminId: user._id 
      });
      toast.success("Team deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete team");
    }
  };

  const startEditing = (team: EnrichedTeam) => {
    setEditingTeam(team);
    setFormData({
      name: team.name || "",
      leaderId: team.leaderId,
      memberIds: team.memberIds,
      supervisorId: team.supervisorId,
    });
    setIsCreating(true);
  };

  return {
    selectedProgram,
    setSelectedProgram,
    isCreating,
    setIsCreating,
    editingTeam,
    viewingAttendanceTeam,
    setViewingAttendanceTeam,
    formData,
    setFormData,
    programs,
    teams,
    availableStudents,
    supervisors,
    handleCreateTeam,
    handleUpdateTeam,
    handleDeleteTeam,
    startEditing,
    resetForm,
  };
}
