import { axiosInstance } from "../../../AxiosClient";
import { TimeSlotDto } from "../response/TimeSlotDto";
import { CreateTimeSlotForm } from "../form/CreateTimeSlotForm";
import {EditTimeSlotForm} from "../form/EditTimeSlot.ts";
import {TimeSlotApi} from "../TimeSlotApi.ts";

export class TimeSlotApiAxios implements TimeSlotApi{
    async create(form: CreateTimeSlotForm): Promise<TimeSlotDto> {
        const response = await axiosInstance.post<TimeSlotDto>(`/workshops/${form.workshopId}/timeslots`, form);
        return response.data;
    }

    async update(workshopId: string, id: string, form: EditTimeSlotForm): Promise<TimeSlotDto> {
        const response = await axiosInstance.put<TimeSlotDto>(`/workshops/${workshopId}/timeslots/${id}`, form);
        return response.data;
    }

    async delete(workshopId: string, id: string): Promise<void> {
        await axiosInstance.delete<void>(`/workshops/${workshopId}/timeslots/${id}`);
    }

    async getByWorkshopId(workshopId: string, employeeId?: string): Promise<TimeSlotDto[]> {
        let url = `/workshops/${workshopId}/timeslots`;
        if (employeeId) {
            url += `?employeeId=${employeeId}`;
        }
        const response = await axiosInstance.get<TimeSlotDto[]>(url);
        return response.data;
    }

    async get(id: string, workshopId: string): Promise<TimeSlotDto> {
        const response = await axiosInstance.get<TimeSlotDto>(`/workshops/${workshopId}/timeslots/${id}`);
        return response.data;
    }
}
