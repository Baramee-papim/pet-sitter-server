import { GetOwnersQuery } from "./owner";
import { UserStatus } from "./user";

export interface AdminGetOwnersQuery extends GetOwnersQuery {
  status?: UserStatus;
}
