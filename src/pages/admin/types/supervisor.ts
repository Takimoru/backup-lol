import { Id } from "../../../../convex/_generated/dataModel";

export interface Supervisor {
  _id: Id<"users">;
  email: string;
  name: string;
  role: "admin" | "supervisor" | "student";
  nidn?: string;
}

export interface SupervisorForm {
  email: string;
  name: string;
  nidn: string;
  password?: string;
}
