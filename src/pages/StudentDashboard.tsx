import { useQuery } from "convex/react";
import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../contexts/AuthContext";
import { Plus } from "lucide-react";
import { ProgramDetails } from "../components/ProgramDetails";
import { PendingRegistrationNotice } from "./student/PendingRegistrationNotice";
import { CreateProgramModal } from "./student/CreateProgramModal";
import { DashboardStats } from "./student/DashboardStats";
import { MyTeams } from "./student/MyTeams";

export function StudentDashboard() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const selectedProgramId = searchParams.get("program");

  const programs = useQuery(api.programs.getAllPrograms, {
    includeArchived: false,
  });
  const userRegistrations = user
    ? useQuery(api.registrations.getUserRegistrations, {
        userId: user._id,
      })
    : null;
  const myTeams = user
    ? useQuery(api.teams.getTeamsForUser, { userId: user._id })
    : null;
  const today = new Date().toISOString().split("T")[0];
  const todaysAttendance = user
    ? useQuery(api.attendance.getAttendanceByUser, {
        userId: user._id,
        startDate: today,
        endDate: today,
      })
    : null;

  const [showProgramForm, setShowProgramForm] = useState(false);

  const isPendingStudent = user?.role === "pending";
  const isApprovedStudent = user?.role === "student";

  const selectedProgram = useMemo(() => {
    return programs?.find((p) => p._id === selectedProgramId);
  }, [programs, selectedProgramId]);

  const selectedProgramRegistration = useMemo(() => {
    return userRegistrations?.find((r) => r.programId === selectedProgramId);
  }, [userRegistrations, selectedProgramId]);

  if (selectedProgramId && selectedProgram) {
    return (
      <ProgramDetails 
        program={selectedProgram} 
        registration={selectedProgramRegistration}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
        </div>
        {isApprovedStudent && (
          <button
            onClick={() => setShowProgramForm(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-5 h-5" />
            <span>Create Work Program</span>
          </button>
        )}
      </div>

      {isPendingStudent && <PendingRegistrationNotice />}

      {showProgramForm && user && (
        <CreateProgramModal 
          onClose={() => setShowProgramForm(false)} 
          userId={user._id}
        />
      )}

      <DashboardStats 
        programs={programs} 
        userRegistrations={userRegistrations} 
      />

      {user && (
        <MyTeams 
          myTeams={myTeams} 
          userId={user._id} 
          todaysAttendance={todaysAttendance} 
        />
      )}
    </div>
  );
}
