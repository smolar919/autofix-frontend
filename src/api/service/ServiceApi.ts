import {CreateServiceForm} from "./form/CreateServiceForm.ts";
import {ServiceDto} from "./response/ServiceDto.ts";
import {EditServiceForm} from "./form/EditServiceForm.ts";

export interface ServiceApi {
    save(form: CreateServiceForm): Promise<ServiceDto>;
    edit(form: EditServiceForm, id: string): Promise<ServiceDto>;
    delete(id: string): Promise<void>;
    listServicesByWorkshopId(workshopId: string): Promise<ServiceDto[]>;
    get(id: string): Promise<ServiceDto>;
}