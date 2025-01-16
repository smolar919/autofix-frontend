import { v4 as uuidv4 } from 'uuid';
import {VehicleApi} from "../VehicleApi.ts";
import {VehicleDto} from "../response/VehicleDto.ts";
import {CreateVehicleForm} from "../form/CreateVehicleForm.ts";
import {EditVehicleForm} from "../form/EditVehicleForm.ts";

export class VehicleApiMock implements VehicleApi {
    getById(id: string): Promise<VehicleDto> {
        throw new Error('Method not implemented.' + id);
    }
    private vehicles: VehicleDto[] = [
        {
            id: "mock-vehicle-1",
            make: "Toyota",
            model: "Corolla",
            year: 2015,
            vin: "VIN1234567890",
            registrationNumber: "ABC123",
            ownerId: "user-1",
        },
        {
            id: "mock-vehicle-2",
            make: "Ford",
            model: "Focus",
            year: 2018,
            vin: "VIN0987654321",
            registrationNumber: "XYZ789",
            ownerId: "user-2",
        },
    ];

    async save(form: CreateVehicleForm): Promise<VehicleDto> {
        const newVehicle: VehicleDto = {
            id: uuidv4(),
            make: form.make,
            model: form.model,
            year: form.year,
            vin: form.vin,
            registrationNumber: form.registrationNumber,
            ownerId: form.ownerId,
        };
        this.vehicles.push(newVehicle);
        return newVehicle;
    }

    async update(form: EditVehicleForm, id: string): Promise<VehicleDto> {
        const vehicle = this.vehicles.find(v => v.id === id);
        if (!vehicle) {
            throw new Error("Vehicle not found");
        }
        Object.assign(vehicle, form);
        return vehicle;
    }

    async delete(id: string): Promise<void> {
        this.vehicles = this.vehicles.filter(vehicle => vehicle.id !== id);
    }

    async getByOwnerId(userId: string): Promise<VehicleDto[]> {
        return this.vehicles.filter(vehicle => vehicle.ownerId === userId);
    }
}
