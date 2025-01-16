import {ServiceApi} from "../ServiceApi.ts";
import {EditServiceForm} from "../form/EditServiceForm.ts";
import {ServiceDto} from "../response/ServiceDto.ts";
import {CreateServiceForm} from "../form/CreateServiceForm.ts";
import {axiosInstance} from "../../../AxiosClient.ts";

export class ServiceApiAxios implements ServiceApi {
    async delete(id: string): Promise<void> {
        await axiosInstance.delete<void>(`/services/${id}`);
    }

    async edit(form: EditServiceForm, id: string): Promise<ServiceDto> {
        const response = await axiosInstance.put<ServiceDto>(`/services/${id}`, form);
        return response.data;
    }

    async listServicesByWorkshopId(workshopId: string): Promise<ServiceDto[]> {
        const response = await axiosInstance.get<ServiceDto[]>(`/services/workshop/${workshopId}`);
        return response.data;
    }

    async save(form: CreateServiceForm): Promise<ServiceDto> {
        const response = await axiosInstance.post<ServiceDto>(`/services`, form);
        return response.data;
    }

    async get(id: string) {
        const response = await axiosInstance.get<ServiceDto>(`/services/${id}`);
        return response.data;
    }
}