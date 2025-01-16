import {SearchForm} from "../../commons/search/SearchForm.ts";
import {SearchResponse} from "../../commons/search/SearchResponse.ts";
import {AddExistingEmployeeForm} from "./form/AddExistingEmployeeForm.ts";
import {EditEmployeeForm} from "./form/EditEmployeeForm.ts";
import {EmployeeDto} from "./response/EmployeeDto.ts";
import {CreateNewEmployeeForm} from "./form/CreateNewEmployeeForm.ts";

export interface EmployeeApi {
    search(form: SearchForm): Promise<SearchResponse<EmployeeDto>>;
    createNew(form: CreateNewEmployeeForm): Promise<EmployeeDto>;
    addExisting(form: AddExistingEmployeeForm): Promise<EmployeeDto>;
    edit(id: string, form: EditEmployeeForm): Promise<EmployeeDto>;
    delete(id: string): Promise<void>;
    listByWorkshop(workshopId: string): Promise<EmployeeDto[]>;
    get(id: string): Promise<EmployeeDto>;
}
