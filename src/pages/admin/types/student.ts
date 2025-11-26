import { Id } from "../../../../convex/_generated/dataModel";

export interface Registration {
  _id: Id<"registrations">;
  fullName?: string;
  email: string;
  studentId?: string;
  phone?: string;
  program?: {
    title: string;
  };
  submittedAt: number; // or string, depending on convex return, but usually number for timestamps, though format() takes Date or number. usage: new Date(registration.submittedAt)
  paymentProofUrl?: string;
  reviewedAt?: number;
  reviewedBy?: {
    name: string;
  };
  user?: {
    name: string;
  };
}

export type RegistrationTab = "pending" | "approved";
