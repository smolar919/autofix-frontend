import {BookingApi} from "../BookingApi.ts";
import {BookingDto, BookingStatus} from "../response/BookingDto.ts";
import {CreateBookingForm} from "../form/CreateBookingForm.ts";
import {EditBookingForm} from "../form/EditBookingForm.ts";
import { v4 as uuidv4 } from 'uuid';

export class BookingApiMock implements BookingApi {
    private bookings: BookingDto[] = [
        {
            id: "mock-booking-1",
            workshopId: "workshop-123",
            userId: "user-456",
            vehicleId: "vehicle-789",
            serviceIds: ["service-1", "service-2"],
            employeeId: "employee-101",
            bookingDate: new Date("2025-01-01T10:00:00Z"),
            bookingStatus: BookingStatus.PENDING,
        },
        {
            id: "mock-booking-2",
            workshopId: "workshop-123",
            userId: "user-789",
            vehicleId: "vehicle-456",
            serviceIds: ["service-3"],
            employeeId: "employee-102",
            bookingDate: new Date("2025-01-02T14:00:00Z"),
            bookingStatus: BookingStatus.CONFIRMED,
        },
    ];

    async save(form: CreateBookingForm): Promise<BookingDto> {
        const newBooking: BookingDto = {
            id: uuidv4(),
            workshopId: form.workshopId,
            userId: form.userId,
            vehicleId: form.vehicleId,
            serviceIds: form.serviceIds,
            employeeId: form.employeeId,
            bookingDate: form.bookingDate,
            bookingStatus: BookingStatus.PENDING,
        };
        this.bookings.push(newBooking);
        return newBooking;
    }

    async update(form: EditBookingForm): Promise<BookingDto> {
        const booking = this.bookings.find(b => b.id === form.bookingId);
        if (!booking) {
            throw new Error("Booking not found");
        }
        booking.bookingDate = form.newDate;
        return booking;
    }

    async cancel(id: string): Promise<void> {
        const booking = this.bookings.find(b => b.id === id);
        if (!booking) {
            throw new Error("Booking not found");
        }
        booking.bookingStatus = BookingStatus.CANCELED;
    }

    async get(id: string): Promise<BookingDto> {
        const booking = this.bookings.find(b => b.id === id);
        if (!booking) {
            throw new Error("Booking not found");
        }
        return booking;
    }

    async getByUserId(userId: string): Promise<BookingDto[]> {
        return this.bookings.filter(b => b.userId === userId);
    }

    async getByVehicleId(vehicleId: string): Promise<BookingDto[]> {
        return this.bookings.filter(b => b.vehicleId === vehicleId);
    }

    async getByWorkshopId(workshopId: string): Promise<BookingDto[]> {
        return this.bookings.filter(b => b.workshopId === workshopId);
    }

    async getByEmployeeId(employeeId: string): Promise<BookingDto[]> {
        return this.bookings.filter(b => b.employeeId === employeeId);
    }
}
