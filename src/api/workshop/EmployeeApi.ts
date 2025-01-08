import {SearchForm} from "../../commons/search/SearchForm.ts";
import {SearchResponse} from "../../commons/search/SearchResponse.ts";
import {CreateEmployeeForm} from "./form/CreateEmployeeForm.ts";
import {EditEmployeeForm} from "./form/EditEmployeeForm.ts";
import {EmployeeDto} from "./response/EmployeeDto.ts";

export interface EmployeeApi {
    search(form: SearchForm): Promise<SearchResponse<EmployeeDto>>;
    create(form: CreateEmployeeForm): Promise<EmployeeDto>;
    edit(id: string, form: EditEmployeeForm): Promise<EmployeeDto>;
    delete(id: string): Promise<void>;
    listByWorkshop(workshopId: string): Promise<EmployeeDto[]>;
}