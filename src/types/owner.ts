import { ParamsDictionary } from "express-serve-static-core";

export interface OwnerIdParams extends ParamsDictionary {
  ownerId: string;
}

export interface GetOwnersQuery {
  seed?: string;
  page?: string;
  limit?: string;
  keyword?: string;
}
