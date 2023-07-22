import {GrantedRoles} from "./granted-roles";

export class UserLoginResponse {
  jwt: string = "";
  roles: Set<GrantedRoles> = new Set<GrantedRoles>();
}
