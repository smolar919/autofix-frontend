import {AddressDto} from "./AddressDto.ts";
import {EmployeeDto} from "./EmployeeDto.ts";

export interface WorkshopDto {
    id: string;
    name: string;
    address: AddressDto;
    employees: EmployeeDto[];
}