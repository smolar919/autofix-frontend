import {BookingApi} from "../BookingApi.ts";
import {CreateBookingForm} from "../form/CreateBookingForm.ts";
import {BookingDto} from "../response/BookingDto.ts";
import {axiosInstance} from "../../../AxiosClient.ts";
import {EditBookingForm} from "../form/EditBookingForm.ts";

export class BookingApiAxios implements BookingApi {
    async save(form: CreateBookingForm): Promise<BookingDto> {
        const response = await axiosInstance.post<BookingDto>(`/bookings`, form);
        return response.data;
    }

    async update(form: EditBookingForm): Promise<BookingDto> {
        const response = await axiosInstance.put<BookingDto>(`/bookings/${form.bookingId}`, form);
        return response.data;
    }

    async cancel(id: string): Promise<void> {
        await axiosInstance.delete<void>(`/bookings/${id}`);
    }

    async get(id: string): Promise<BookingDto> {
        const response = await axiosInstance.get<BookingDto>(`/bookings/${id}`);
        return response.data;
    }

    async getByUserId(userId: string): Promise<BookingDto[]> {
        const response = await axiosInstance.get<BookingDto[]>(`/users/${userId}/bookings`);
        return response.data;
    }

    async getByVehicleId(vehicleId: string): Promise<BookingDto[]> {
        const response = await axiosInstance.get<BookingDto[]>(`/vehicles/${vehicleId}/bookings`);
        return response.data;
    }

    async getByWorkshopId(workshopId: string): Promise<BookingDto[]> {
        const response = await axiosInstance.get<BookingDto[]>(`/workshops/${workshopId}/bookings`);
        return response.data;
    }

    async getByEmployeeId(employeeId: string): Promise<BookingDto[]> {
        const response = await axiosInstance.get<BookingDto[]>(`/employees/${employeeId}/bookings`);
        return response.data;
    }
}