import { User } from "@supabase/supabase-js";
import { UserRole } from "./user";
import { Request } from "express";

export interface GetBookingsFilter {
  petSitterId?: number;
  petOwnerId?: string;
}

export type RequestWithUser = Request & { user?: User & { role: UserRole } };