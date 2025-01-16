import {CreateVehicleForm} from "./form/CreateVehicleForm.ts";
import {VehicleDto} from "./response/VehicleDto.ts";
import {EditVehicleForm} from "./form/EditVehicleForm.ts";

export interface VehicleApi {
    save(form: CreateVehicleForm): Promise<VehicleDto>;
    update(form: EditVehicleForm, id: string): Promise<VehicleDto>;
    delete(id: string): Promise<void>;
    getByOwnerId(userId: string): Promise<VehicleDto[]>;
    getById(id: string): Promise<VehicleDto>;
}