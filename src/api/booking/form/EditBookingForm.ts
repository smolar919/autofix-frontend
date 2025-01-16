import {BookingStatus} from "../response/BookingDto.ts";

export interface EditBookingForm {
    bookingId: string;
    newDate?: Date;
    workDescription?: string;
    status?: BookingStatus;
}