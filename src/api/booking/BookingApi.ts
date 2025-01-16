import {CreateBookingForm} from "./form/CreateBookingForm.ts";
import {BookingDto, BookingStatus} from "./response/BookingDto.ts";
import {EditBookingForm} from "./form/EditBookingForm.ts";
import {SearchForm} from "../../commons/search/SearchForm.ts";
import {SearchResponse} from "../../commons/search/SearchResponse.ts";

export interface BookingApi {
    save(form: CreateBookingForm): Promise<BookingDto>;
    update(form: EditBookingForm): Promise<BookingDto>;
    cancel(id: string): Promise<void>;
    get(id: string): Promise<BookingDto>;
    getByUserId(userId: string): Promise<BookingDto[]>;
    getByVehicleId(vehicleId: string): Promise<BookingDto[]>;
    getByWorkshopId(workshopId: string): Promise<BookingDto[]>;
    getByEmployeeId(employeeId: string): Promise<BookingDto[]>;
    search(form: SearchForm): Promise<SearchResponse<BookingDto>>
    updateBookingStatus(id: string, newStatus: BookingStatus): Promise<void>
}