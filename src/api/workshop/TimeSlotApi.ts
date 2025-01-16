import {CreateTimeSlotForm} from "./form/CreateTimeSlotForm.ts";
import {TimeSlotDto} from "./response/TimeSlotDto.ts";
import {EditTimeSlotForm} from "./form/EditTimeSlot.ts";


export interface TimeSlotApi {
    create(form: CreateTimeSlotForm): Promise<TimeSlotDto>;

    update(workshopId: string, id: string, form: EditTimeSlotForm): Promise<TimeSlotDto>;

    delete(workshopId: string, id: string): Promise<void>;

    getByWorkshopId(workshopId: string, employeeId?: string): Promise<TimeSlotDto[]>;

    get(id: string, workshopId: string): Promise<TimeSlotDto>;
}
