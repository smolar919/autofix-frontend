import { axiosInstance } from "../../../AxiosClient.ts";
import {VehicleApi} from "../VehicleApi.ts";
import {CreateVehicleForm} from "../form/CreateVehicleForm.ts";
import {VehicleDto} from "../response/VehicleDto.ts";
import {EditVehicleForm} from "../form/EditVehicleForm.ts";

export class VehicleApiAxios implements VehicleApi {
    async save(form: CreateVehicleForm): Promise<VehicleDto> {
        const response = await axiosInstance.post<VehicleDto>(`/vehicle`, form);
        return response.data;
    }

    async update(form: EditVehicleForm, id: string): Promise<VehicleDto> {
        const response = await axiosInstance.put<VehicleDto>(`/vehicle/${id}`, form);
        return response.data;
    }

    async delete(id: string): Promise<void> {
        await axiosInstance.delete<void>(`/vehicle/${id}`);
    }

    async getByOwnerId(userId: string): Promise<VehicleDto[]> {
        const response = await axiosInstance.get<VehicleDto[]>(`/vehicle/owner/${userId}`);
        return response.data;
    }

    async getById(id: string): Promise<VehicleDto> {
        const response = await axiosInstance.get<VehicleDto>(`/vehicle/${id}`);
        return response.data;
    }
}