import {AddressDto} from "./AddressDto.ts";
import {EmployeeDto} from "./EmployeeDto.ts";

export interface WorkshopDto {
    id: string;
    ownerId: string;
    name: string;
    address: AddressDto;
    employees: EmployeeDto[];
    isVisible: boolean;
    description: string;
    serviceIds: string[];
    openingHours: string;
}