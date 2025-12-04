import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ProgramDetails } from "../components/ProgramDetails";
import { PendingRegistrationNotice } from "./student/components/PendingRegistrationNotice";
import { CreateProgramModal } from "./student/components/CreateProgramModal";
import { useStudentData } from "./student/hooks/useStudentData";
import { DashboardSidebar } from "./student/components/DashboardSidebar";
import { DashboardHeader } from "./student/components/DashboardHeader";
import { ProjectGrid } from "./student/components/ProjectGrid";

export function StudentDashboard() {
  const [searchParams] = useSearchParams();
  const selectedProgramId = searchParams.get("program");
  const [showProgramForm, setShowProgramForm] = useState(false);

  const {
    user,
    programs,
    userRegistrations,
    myTeams,
    todaysAttendance,
    isLoading
  } = useStudentData();

  const isPendingStudent = user?.role === "pending";

  const selectedProgram = useMemo(() => {
    return programs?.find((p) => p._id === selectedProgramId);
  }, [programs, selectedProgramId]);

  const selectedProgramRegistration = useMemo(() => {
    return userRegistrations?.find((r) => r.programId === selectedProgramId);
  }, [userRegistrations, selectedProgramId]);

  const selectedTeam = useMemo(() => {
    return myTeams?.find((t) => t.programId === selectedProgramId);
  }, [myTeams, selectedProgramId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (selectedProgramId && selectedProgram) {
    return (
      <ProgramDetails 
        program={selectedProgram} 
        registration={selectedProgramRegistration}
        team={selectedTeam}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <DashboardSidebar 
        user={user} 
      />

      {/* Main Content Area */}
      <div className="ml-64 min-h-screen">
        <div className="p-8">
          {isPendingStudent && <PendingRegistrationNotice />}

          <DashboardHeader />

          {user && (
            <ProjectGrid 
              teams={myTeams} 
              userId={user._id}
              todaysAttendance={todaysAttendance}
            />
          )}
        </div>
      </div>

      {/* Create Program Modal */}
      {showProgramForm && user && (
        <CreateProgramModal 
          onClose={() => setShowProgramForm(false)} 
          userId={user._id}
        />
      )}
    </div>
  );
}

