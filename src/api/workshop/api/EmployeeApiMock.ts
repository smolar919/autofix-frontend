import { EmployeeApi } from "../EmployeeApi";
import { SearchForm } from "../../../commons/search/SearchForm";
import { SearchResponse } from "../../../commons/search/SearchResponse";
import { EmployeeDto } from "../response/EmployeeDto";
import { AddExistingEmployeeForm } from "../form/AddExistingEmployeeForm";
import { EditEmployeeForm } from "../form/EditEmployeeForm";
import { CreateNewEmployeeForm } from "../form/CreateNewEmployeeForm";
import { v4 as uuidv4 } from "uuid";
import { CriteriaOperator } from "../../../commons/search/CriteriaOperator";

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
            userId: "user-1",
        },
        {
            id: "mock-employee-2",
            firstName: "Jane",
            lastName: "Smith",
            position: "Receptionist",
            phoneNumber: "098-765-4321",
            email: "jane.smith@example.com",
            workshopId: "workshop-2",
            userId: "user-2",
        },
    ];

    async search(form: SearchForm): Promise<SearchResponse<EmployeeDto>> {
        const filtered = this.employees.filter((employee) => {
            return form.criteria.every((criteria) => {
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

    async createNew(form: CreateNewEmployeeForm): Promise<EmployeeDto> {
        const newEmployee: EmployeeDto = {
            id: uuidv4(),
            userId: uuidv4(),
            firstName: form.firstName,
            lastName: form.lastName,
            position: form.position,
            phoneNumber: form.phoneNumber,
            email: form.email,
            workshopId: form.workshopId,
        };
        this.employees.push(newEmployee);
        return newEmployee;
    }

    async addExisting(form: AddExistingEmployeeForm): Promise<EmployeeDto> {
        const existingEmployee: EmployeeDto = {
            id: uuidv4(),
            userId: uuidv4(),
            firstName: "Existing",
            lastName: "Employee",
            position: form.position,
            phoneNumber: form.phoneNumber,
            email: form.email,
            workshopId: form.workshopId,
        };
        this.employees.push(existingEmployee);
        return existingEmployee;
    }

    async edit(id: string, form: EditEmployeeForm): Promise<EmployeeDto> {
        const employee = this.employees.find((e) => e.id === id);
        if (!employee) {
            throw new Error("Employee not found");
        }
        Object.assign(employee, form);
        return employee;
    }

    async delete(id: string): Promise<void> {
        this.employees = this.employees.filter((e) => e.id !== id);
    }

    async listByWorkshop(workshopId: string): Promise<EmployeeDto[]> {
        return this.employees.filter((e) => e.workshopId === workshopId);
    }

    async get(id: string): Promise<EmployeeDto> {
        const employee = this.employees.find((e) => e.id === id);
        if (!employee) {
            throw new Error("Employee not found");
        }
        return employee;
    }
}
