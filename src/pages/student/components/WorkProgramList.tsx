import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Plus, Calendar, Users, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface WorkProgramListProps {
  teamId: Id<"teams">;
  isLeader: boolean;
}

export function WorkProgramList({ teamId, isLeader }: WorkProgramListProps) {
  const navigate = useNavigate();
  const workPrograms = useQuery(api.workPrograms.getByTeam, { teamId });

  if (!workPrograms) {
    return <div>Loading work programs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Work Programs</h2>
          <p className="text-muted-foreground">
            Manage and track long-term initiatives
          </p>
        </div>
        {isLeader && (
          <Button onClick={() => navigate(`/team/${teamId}/programs/new`)}>
            <Plus className="w-4 h-4 mr-2" />
            New Program
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {workPrograms.map((program) => (
          <Card
            key={program._id}
            className="hover:shadow-md transition-all cursor-pointer border-blue-100/50"
            onClick={() => navigate(`/team/${teamId}/programs/${program._id}`)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-blue-950">
                {program.title}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {program.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span>
                    {format(new Date(program.startDate), "MMM d")} -{" "}
                    {format(new Date(program.endDate), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>{program.assignedMembers.length} members assigned</span>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="ghost" size="sm" className="text-blue-600">
                  View Details <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {workPrograms.length === 0 && (
          <div className="col-span-full text-center py-12 border border-dashed rounded-lg bg-muted/50">
            <p className="text-muted-foreground">No work programs found</p>
            {isLeader && (
              <Button
                variant="link"
                onClick={() => navigate(`/team/${teamId}/programs/new`)}
              >
                Create your first work program
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
