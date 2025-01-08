import {CreateBookingForm} from "./form/CreateBookingForm.ts";
import {BookingDto} from "./response/BookingDto.ts";
import {EditBookingForm} from "./form/EditBookingForm.ts";

export interface BookingApi {
    save(form: CreateBookingForm): Promise<BookingDto>;
    update(form: EditBookingForm): Promise<BookingDto>;
    cancel(id: string): Promise<void>;
    get(id: string): Promise<BookingDto>;
    getByUserId(userId: string): Promise<BookingDto[]>;
    getByVehicleId(vehicleId: string): Promise<BookingDto[]>;
    getByWorkshopId(workshopId: string): Promise<BookingDto[]>;
    getByEmployeeId(employeeId: string): Promise<BookingDto[]>;
}