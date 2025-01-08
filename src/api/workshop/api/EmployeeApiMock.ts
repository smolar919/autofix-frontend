import {EmployeeApi} from "../EmployeeApi.ts";
import {SearchForm} from "../../../commons/search/SearchForm.ts";
import {SearchResponse} from "../../../commons/search/SearchResponse.ts";
import {EmployeeDto} from "../response/EmployeeDto.ts";
import {CreateEmployeeForm} from "../form/CreateEmployeeForm.ts";
import {EditEmployeeForm} from "../form/EditEmployeeForm.ts";
import { v4 as uuidv4 } from 'uuid';
import {CriteriaOperator} from "../../../commons/search/CriteriaOperator.ts";

export class EmployeeApiMock implements EmployeeApi {
    private employees: EmployeeDto[] = [
        {
            id: "mock-employee-1",
            firstName: "John",
            lastName: "Doe",
            position: "Mechanic",
            phoneNumber: "123-456-7890",
            email: "john.doe@example.com",
            workshopId: "workshop-1",
        },
        {
            id: "mock-employee-2",
            firstName: "Jane",
            lastName: "Smith",
            position: "Receptionist",
            phoneNumber: "098-765-4321",
            email: "jane.smith@example.com",
            workshopId: "workshop-2",
        },
    ];

    async search(form: SearchForm): Promise<SearchResponse<EmployeeDto>> {
        const filtered = this.employees.filter(employee => {
            return form.criteria.every(criteria => {
                const value = (employee as any)[criteria.fieldName];
                switch (criteria.operator) {
                    case CriteriaOperator.EQUALS:
                        return value === criteria.value;
                    case CriteriaOperator.NOT_EQUALS:
                        return value !== criteria.value;
                    case CriteriaOperator.LIKE:
                        return typeof value === "string" && value.includes(criteria.value);
                    default:
                        return false;
                }
            });
        });

        const start = form.page * form.size;
        const end = start + form.size;
        const items = filtered.slice(start, end);

        return {
            items,
            total: filtered.length,
        };
    }

    async create(form: CreateEmployeeForm): Promise<EmployeeDto> {
        const newEmployee: EmployeeDto = {
            id: uuidv4(),
            ...form,
        };
        this.employees.push(newEmployee);
        return newEmployee;
    }

    async edit(id: string, form: EditEmployeeForm): Promise<EmployeeDto> {
        const employee = this.employees.find(e => e.id === id);
        if (!employee) {
            throw new Error("Employee not found");
        }
        Object.assign(employee, form);
        return employee;
    }

    async delete(id: string): Promise<void> {
        this.employees = this.employees.filter(e => e.id !== id);
    }

    async listByWorkshop(workshopId: string): Promise<EmployeeDto[]> {
        return this.employees.filter(e => e.workshopId === workshopId);
    }
}