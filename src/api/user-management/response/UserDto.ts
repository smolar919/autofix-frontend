export interface UserDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdOn: Date;
    createdById: string;
    deletedOn: Date | null;
    deletedById: string | null;
    blocked: boolean;
}