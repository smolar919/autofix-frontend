export interface UserDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdOn: Date;
    deletedOn: Date | null;
    deletedById: string | null;
    blocked: boolean;
    role: Role;
}

export enum Role {
    CUSTOMER,
    ADMIN,
    PROVIDER
}