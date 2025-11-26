import { Id } from "../../../../convex/_generated/dataModel";

export interface TeamMember {
  _id: Id<"users">;
  name: string;
  email: string;
}

export interface EnrichedTeam {
  _id: Id<"teams">;
  name?: string;
  programId: Id<"programs">;
  leaderId: Id<"users">;
  memberIds: Id<"users">[];
  leader?: TeamMember;
  members?: TeamMember[];
}

export interface TeamForm {
  name: string;
  leaderId: string;
  memberIds: string[];
}
