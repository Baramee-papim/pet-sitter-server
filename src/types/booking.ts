import { User } from "@supabase/supabase-js";
import { UserRole } from "./user";
import { Request } from "express";

export interface GetBookingsFilter {
  petSitterId?: number;
  petOwnerId?: string;
}

export type RequestWithUser = Request & { user?: User & { role: UserRole } };


export interface GetBookingListsQuery {
  keyword?: string;
  status?: string;
  currentPage?: number;
  limit?: number;
}


export const STATUS_OPTIONS = [
  { value: "all", label: "All status" },
  { value: "waiting_confirm", label: "Waiting for confirm" },
  { value: "waiting_service", label: "Waiting for service" },
  { value: "in_service", label: "In service" },
  { value: "success", label: "Success" },
  { value: "canceled", label: "Canceled" },
];