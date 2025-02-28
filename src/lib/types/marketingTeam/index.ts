import { ClerkUserPublicMetadata } from "../payment";

export type UserMetadataTeam = {
    teamId: string;
    role: 'manager' | 'member';
}

export type MembersWithRoleToCheck = {
    role: string;
    members: string[];
}

export type PartialClerkUser = {
    id: string;
    fullName: string;
    email: string;
    publicMetadata: ClerkUserPublicMetadata
}