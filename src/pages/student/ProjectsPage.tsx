import { useStudentData } from "./hooks/useStudentData";
import { DashboardSidebar } from "./components/DashboardSidebar";
import { DashboardHeader } from "./components/DashboardHeader";
import { WorkProgramList } from "./components/WorkProgramList";

export function ProjectsPage() {
  const { user, myTeams, isLoading } = useStudentData();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar 
        user={user} 
      />

      <div className="ml-64 min-h-screen">
        <div className="p-8">
          <DashboardHeader />
          
          {myTeams?.map(team => (
            <div key={team._id} className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-muted-foreground">Team: {team.name}</h2>
              <WorkProgramList 
                teamId={team._id} 
                isLeader={team.leaderId === user?._id} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
