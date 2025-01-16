import { v4 as uuidv4 } from "uuid";
import {TimeSlotDto, TimeSlotStatus} from "../response/TimeSlotDto";
import { CreateTimeSlotForm } from "../form/CreateTimeSlotForm";
import {EditTimeSlotForm} from "../form/EditTimeSlot.ts";

export class TimeSlotApiMock {
    private timeSlots: TimeSlotDto[] = [];

    async create(form: CreateTimeSlotForm): Promise<TimeSlotDto> {
        const newTimeSlot: TimeSlotDto = {
            id: uuidv4(),
            workshopId: form.workshopId,
            employeeId: form.employeeId,
            startDateTime: form.startDateTime,
            endDateTime: form.endDateTime,
            status: TimeSlotStatus.AVAILABLE,
        };
        this.timeSlots.push(newTimeSlot);
        return newTimeSlot;
    }

    async update(workshopId: string, id: string, form: EditTimeSlotForm): Promise<TimeSlotDto> {
        const index = this.timeSlots.findIndex(ts => ts.id === id && ts.workshopId === workshopId);
        if (index === -1) {
            throw new Error("TimeSlot not found");
        }
        const updatedTimeSlot: TimeSlotDto = {
            ...this.timeSlots[index],
            startDateTime: form.startDateTime,
            endDateTime: form.endDateTime,
            status: form.status,
            employeeId: form.employeeId,
        };
        this.timeSlots[index] = updatedTimeSlot;
        return updatedTimeSlot;
    }

    async delete(workshopId: string, id: string): Promise<void> {
        this.timeSlots = this.timeSlots.filter(ts => !(ts.id === id && ts.workshopId === workshopId));
    }

    async getByWorkshopId(workshopId: string, employeeId?: string): Promise<TimeSlotDto[]> {
        let result = this.timeSlots.filter(ts => ts.workshopId === workshopId);
        if (employeeId) {
            result = result.filter(ts => ts.employeeId === employeeId);
        }
        return result;
    }

    async get(id: string, workshopId: string): Promise<TimeSlotDto> {
        const timeSlot = this.timeSlots.find(ts => ts.id === id && ts.workshopId === workshopId);
        if (!timeSlot) {
            throw new Error("TimeSlot not found");
        }
        return timeSlot;
    }
}
