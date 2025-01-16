import {BookingApi} from "../BookingApi.ts";
import {CreateBookingForm} from "../form/CreateBookingForm.ts";
import {BookingDto, BookingStatus} from "../response/BookingDto.ts";
import {axiosInstance} from "../../../AxiosClient.ts";
import {EditBookingForm} from "../form/EditBookingForm.ts";
import {SearchForm} from "../../../commons/search/SearchForm.ts";
import {SearchResponse} from "../../../commons/search/SearchResponse.ts";

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
        const response = await axiosInstance.get<BookingDto[]>(`/bookings/user/${userId}/bookings`);
        return response.data;
    }

    async getByVehicleId(vehicleId: string): Promise<BookingDto[]> {
        const response = await axiosInstance.get<BookingDto[]>(`/bookings/vehicles/${vehicleId}/bookings`);
        return response.data;
    }

    async getByWorkshopId(workshopId: string): Promise<BookingDto[]> {
        const response = await axiosInstance.get<BookingDto[]>(`/bookings/workshop/${workshopId}/bookings`);
        return response.data;
    }

    async getByEmployeeId(employeeId: string): Promise<BookingDto[]> {
        const response = await axiosInstance.get<BookingDto[]>(`/bookings/employee/${employeeId}/bookings`);
        return response.data;
    }
    async search(form: SearchForm): Promise<SearchResponse<BookingDto>> {
        const response = await axiosInstance.post<SearchResponse<BookingDto>>(`/bookings/search`, form);
        return response.data;
    }

    async updateBookingStatus(id: string, newStatus: BookingStatus): Promise<void> {
        await axiosInstance.put<BookingDto>(`/bookings/${id}/status`, null, {
            params: { newStatus }
        });
    }
}