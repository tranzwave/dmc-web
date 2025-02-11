import { ClerkOrganizationPublicMetadata } from "./payment";

export {};

export type Roles =
  | "acm_coordinator"
  | "accountant"
  | "act_coordinator"
  | "admin"
  | "member"
  | "tsp_coordinator";

export type Permissions =
  | "booking_activity:manage"
  | "booking_agent:manage"
  | "booking_hotel:manage"
  | "booking_invoice:manage"
  | "booking_rest:manage"
  | "booking_shops:manage"
  | "booking_transport:manage"
  | "sys_domains:manage"
  | "sys_domains:read"
  | "sys_memberships:manage"
  | "sys_memberships:read"
  | "sys_profile:delete"
  | "sys_profile:manage";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      // Define roles as optional string union types
      role?:
        | "acm_coordinator"
        | "accountant"
        | "act_coordinator"
        | "admin"
        | "member"
        | "tsp_coordinator";

      permissions?: Array<
        | "booking_activity:manage"
        | "booking_agent:manage"
        | "booking_hotel:manage"
        | "booking_invoice:manage"
        | "booking_rest:manage"
        | "booking_shops:manage"
        | "booking_transport:manage"
        | "sys_domains:manage"
        | "sys_domains:read"
        | "sys_memberships:manage"
        | "sys_memberships:read"
        | "sys_profile:delete"
        | "sys_profile:manage"
      >;
    };
    organizationMetadata: ClerkOrganizationPublicMetadata
  }
}
