import { EmployeeApi } from "../EmployeeApi.ts";
import { SearchForm } from "../../../commons/search/SearchForm.ts";
import { SearchResponse } from "../../../commons/search/SearchResponse.ts";
import { axiosInstance } from "../../../AxiosClient.ts";
import { AddExistingEmployeeForm } from "../form/AddExistingEmployeeForm.ts";
import { CreateNewEmployeeForm } from "../form/CreateNewEmployeeForm.ts";
import { EditEmployeeForm } from "../form/EditEmployeeForm.ts";
import { EmployeeDto } from "../response/EmployeeDto.ts";

export class EmployeeApiAxios implements EmployeeApi {
    async search(form: SearchForm): Promise<SearchResponse<EmployeeDto>> {
        const response = await axiosInstance.post<SearchResponse<EmployeeDto>>(`/employee/search`, form);
        return response.data;
    }

    async createNew(form: CreateNewEmployeeForm): Promise<EmployeeDto> {
        const response = await axiosInstance.post<EmployeeDto>(`/employee/create-new`, form);
        return response.data;
    }

    async addExisting(form: AddExistingEmployeeForm): Promise<EmployeeDto> {
        const response = await axiosInstance.post<EmployeeDto>(`/employee/add-existing`, form);
        return response.data;
    }

    async edit(id: string, form: EditEmployeeForm): Promise<EmployeeDto> {
        const response = await axiosInstance.put<EmployeeDto>(`/employee/${id}`, form);
        return response.data;
    }

    async delete(id: string): Promise<void> {
        await axiosInstance.delete<void>(`/employee/${id}`);
    }

    async listByWorkshop(workshopId: string): Promise<EmployeeDto[]> {
        const response = await axiosInstance.get<EmployeeDto[]>(`/employee/workshop/${workshopId}`);
        return response.data;
    }
    async get(id: string): Promise<EmployeeDto> {
        const response = await axiosInstance.get<EmployeeDto>(`/employee/${id}`);
        return response.data;
    }
}
