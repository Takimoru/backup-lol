import { useStudentData } from "./hooks/useStudentData";
import { DashboardSidebar } from "./components/DashboardSidebar";
import { DashboardHeader } from "./components/DashboardHeader";
import { ProjectGrid } from "./components/ProjectGrid";

export function ProjectsPage() {
  const { user, myTeams, todaysAttendance, isLoading } = useStudentData();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar 
        user={user} 
        onCreateProject={() => {/* Will be handled by modal */}}
      />

      <div className="ml-64 min-h-screen">
        <div className="p-8">
          <DashboardHeader />
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Work Programs</h1>
            <p className="text-muted-foreground mt-1">Manage your team's work programs and progress</p>
          </div>

          {user && (
            <ProjectGrid 
              teams={myTeams} 
              userId={user._id}
              todaysAttendance={todaysAttendance}
            />
          )}
        </div>
      </div>
    </div>
  );
}
