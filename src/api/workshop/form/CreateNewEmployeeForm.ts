export interface CreateNewEmployeeForm {
    firstName: string;
    lastName: string;
    position: string;
    phoneNumber: string;
    email: string;
    workshopId: string;
    password: string | null;
}