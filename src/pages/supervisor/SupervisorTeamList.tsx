import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { SupervisorLayout } from "./components/SupervisorLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Users, Eye } from "lucide-react";

export function SupervisorTeamList() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const teams = useQuery(
    api.teams.getTeamsBySupervisor,
    user?._id ? { supervisorId: user._id } : "skip"
  );

  return (
    <SupervisorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Teams</h1>
          <p className="text-muted-foreground mt-2">
            Teams you are supervising
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team List</CardTitle>
            <CardDescription>
              Click on a team to view details and weekly submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {teams && teams.length > 0 ? (
              <div className="space-y-3">
                {teams.map((team) => (
                  <div
                    key={team._id}
                    className="flex items-center justify-between p-4 border border-blue-100 rounded-lg hover:shadow-md hover:shadow-blue-100 transition-all bg-gradient-to-r from-blue-50/30 to-white"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900">
                        {team.name || "Unnamed Team"}
                      </h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-blue-900/70">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{team.memberIds?.length || 0} members</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => navigate(`/supervisor/teams/${team._id}`)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No teams assigned yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SupervisorLayout>
  );
}
