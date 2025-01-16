import { ServiceApi } from "../ServiceApi.ts";
import { ServiceDto } from "../response/ServiceDto.ts";
import { EditServiceForm } from "../form/EditServiceForm.ts";
import { CreateServiceForm } from "../form/CreateServiceForm.ts";
import { v4 as uuidv4 } from "uuid";

export class ServiceApiMock implements ServiceApi {
    private services: ServiceDto[] = [
        {
            id: "service-1",
            name: "Wymiana oleju",
            description: "Wymiana oleju silnikowego",
            price: 150,
            workshopId: "workshop-123",
        },
        {
            id: "service-2",
            name: "Wymiana klocków hamulcowych",
            description: "Wymiana przednich klocków hamulcowych",
            price: 250,
            workshopId: "workshop-123",
        },
        {
            id: "service-3",
            name: "Diagnostyka komputerowa",
            description: "Pełna diagnostyka komputerowa pojazdu",
            price: 200,
            workshopId: "workshop-456",
        },
    ];

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

    async edit(form: EditServiceForm, id: string): Promise<ServiceDto> {
        const index = this.services.findIndex((service) => service.id === id);
        if (index === -1) {
            throw new Error("Service not found");
        }
        this.services[index] = { ...this.services[index], ...form };
        return this.services[index];
    }

    async delete(id: string): Promise<void> {
        const index = this.services.findIndex((service) => service.id === id);
        if (index === -1) {
            throw new Error("Service not found");
        }
        this.services.splice(index, 1);
    }

    async listServicesByWorkshopId(workshopId: string): Promise<ServiceDto[]> {
        return this.services.filter((service) => service.workshopId === workshopId);
    }

    async get(id: string): Promise<ServiceDto> {
        const service = this.services.find((s) => s.id === id);
        if (!service) {
            throw new Error("Service not found");
        }
        return service;
    }
}

