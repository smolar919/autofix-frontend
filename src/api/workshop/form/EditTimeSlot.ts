import {TimeSlotStatus} from "../response/TimeSlotDto.ts";

export interface EditTimeSlotForm {
    id: string;
    startDateTime: string;
    endDateTime: string;
    status: TimeSlotStatus;
    employeeId: string;
}