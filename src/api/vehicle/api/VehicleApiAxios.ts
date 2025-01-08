import { axiosInstance } from "../../../AxiosClient.ts";
import {VehicleApi} from "../VehicleApi.ts";
import {CreateVehicleForm} from "../form/CreateVehicleForm.ts";
import {VehicleDto} from "../response/VehicleDto.ts";
import {EditVehicleForm} from "../form/EditVehicleForm.ts";

export class VehicleApiAxios implements VehicleApi {
    async save(form: CreateVehicleForm): Promise<VehicleDto> {
        const response = await axiosInstance.post<VehicleDto>(`/vehicles`, form);
        return response.data;
    }

    async update(form: EditVehicleForm, id: string): Promise<VehicleDto> {
        const response = await axiosInstance.put<VehicleDto>(`/vehicles/${id}`, form);
        return response.data;
    }

    async delete(id: string): Promise<void> {
        await axiosInstance.delete<void>(`/vehicles/${id}`);
    }

    async getByOwnerId(userId: string): Promise<VehicleDto[]> {
        const response = await axiosInstance.get<VehicleDto[]>(`/users/${userId}/vehicles`);
        return response.data;
    }
}