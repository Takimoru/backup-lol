import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useAuth } from "../../../contexts/AuthContext";
import toast from "react-hot-toast";
import { WeeklyReport } from "../types/report";

export function useFinalReports() {
  const { user } = useAuth();
  const [selectedProgram, setSelectedProgram] = useState<Id<"programs"> | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Id<"teams"> | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<Id<"weeklyReports"> | null>(null);

  const programs = useQuery(api.programs.getAllPrograms, {
    includeArchived: false,
  });

  const teamsForProgram = useQuery(
    api.teams.getTeamsByProgram,
    selectedProgram ? { programId: selectedProgram } : "skip"
  );

  const reportsForTeam = useQuery(
    api.reports.getReportsByTeam,
    selectedTeam ? { teamId: selectedTeam } : "skip"
  ) as WeeklyReport[] | undefined;

  const selectedReportData = useQuery(
    api.reports.getWeeklyReport,
    selectedReportId
      ? {
          teamId: selectedTeam!,
          week: reportsForTeam?.find((r) => r._id === selectedReportId)?.week || "",
        }
      : "skip"
  ) as WeeklyReport | undefined;

  const approveReportMutation = useMutation(api.reports.approveReport);
  const addSupervisorCommentMutation = useMutation(api.reports.addSupervisorComment);

  const handleApproveReport = async (reportId: Id<"weeklyReports">) => {
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    try {
      await approveReportMutation({ reportId });
      toast.success("Report approved!");
      setSelectedReportId(null);
    } catch (error: any) {
      console.error("Failed to approve:", error);
      toast.error(error.message || "Failed to approve report");
    }
  };

  const handleRequestRevision = async (reportId: Id<"weeklyReports">, comment: string) => {
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please provide a comment");
      return;
    }

    try {
      await addSupervisorCommentMutation({
        reportId,
        comment: comment.trim(),
        supervisorId: user._id,
      });
      toast.success("Revision requested!");
      setSelectedReportId(null);
    } catch (error: any) {
      console.error("Failed to request revision:", error);
      toast.error(error.message || "Failed to request revision");
    }
  };

  return {
    selectedProgram,
    setSelectedProgram,
    selectedTeam,
    setSelectedTeam,
    selectedReportId,
    setSelectedReportId,
    programs,
    teamsForProgram,
    reportsForTeam,
    selectedReportData,
    handleApproveReport,
    handleRequestRevision,
  };
}
