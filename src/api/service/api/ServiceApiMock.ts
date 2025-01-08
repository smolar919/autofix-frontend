import {ServiceApi} from "../ServiceApi.ts";
import {ServiceDto} from "../response/ServiceDto.ts";
import {EditServiceForm} from "../form/EditServiceForm.ts";
import {CreateServiceForm} from "../form/CreateServiceForm.ts";
import { v4 as uuidv4 } from 'uuid';

export class ServiceApiMock implements ServiceApi {
    private services: ServiceDto[] = [];

    async delete(id: string): Promise<void> {
        this.services = this.services.filter(service => service.id !== id);
    }

    async edit(form: EditServiceForm, id: string): Promise<ServiceDto> {
        const index = this.services.findIndex(service => service.id === id);
        if (index === -1) {
            throw new Error("Service not found");
        }
        this.services[index] = { ...this.services[index], ...form };
        return this.services[index];
    }

    async listServicesByWorkshopId(workshopId: string): Promise<ServiceDto[]> {
        return this.services.filter(service => service.workshopId === workshopId);
    }

    async save(form: CreateServiceForm): Promise<ServiceDto> {
        const newService: ServiceDto = {
            id: uuidv4(),
            workshopId: form.workshopId,
            name: form.name,
            description: form.description,
            price: form.price,
        };
        this.services.push(newService);
        return newService;
    }
}
