import {SearchResponse} from "../../../commons/search/SearchResponse.ts";
import {WorkshopDto} from "../response/WorkshopDto.ts";
import {SearchForm} from "../../../commons/search/SearchForm.ts";
import {WorkshopApi} from "../WorkshopApi.ts";
import {axiosInstance} from "../../../AxiosClient.ts";
import {CreateWorkshopForm} from "../form/CreateWorkshopForm.ts";
import {EditWorkshopForm} from "../form/EditWorkshopForm.ts";

export class WorkshopApiAxios implements WorkshopApi {
    async search(form: SearchForm): Promise<SearchResponse<WorkshopDto>> {
        const response = await axiosInstance.post<SearchResponse<WorkshopDto>>(`/workshop/search`, form);
        return response.data;
    }

    async create(form: CreateWorkshopForm): Promise<WorkshopDto> {
        const response = await axiosInstance.post<WorkshopDto>(`/workshop`, form);
        return response.data;
    }

    async edit(id: string, form: EditWorkshopForm): Promise<WorkshopDto> {
        const response = await axiosInstance.put<WorkshopDto>(`/workshop/${id}`, form);
        return response.data;
    }

    async delete(id: string): Promise<void> {
        await axiosInstance.delete<void>(`/workshop/${id}`);
    }

    async get(id: string): Promise<WorkshopDto> {
        const response = await axiosInstance.get<WorkshopDto>(`/workshop/${id}`);
        return response.data;
    }
}