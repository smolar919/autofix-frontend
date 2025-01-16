import { BookingApi } from "../BookingApi.ts";
import { BookingDto, BookingStatus } from "../response/BookingDto.ts";
import { CreateBookingForm } from "../form/CreateBookingForm.ts";
import { EditBookingForm } from "../form/EditBookingForm.ts";
import { v4 as uuidv4 } from 'uuid';
import {SearchForm} from "../../../commons/search/SearchForm.ts";
import {SearchResponse} from "../../../commons/search/SearchResponse.ts";
import {CriteriaOperator} from "../../../commons/search/CriteriaOperator.ts";

export class BookingApiMock implements BookingApi {
    private bookings: BookingDto[] = [
        {
            id: "mock-booking-1",
            workshopId: "workshop-123",
            userId: "user-456",
            vehicleId: "vehicle-789",
            serviceIds: ["service-1", "service-2"],
            employeeId: "employee-101",
            timeSlotId: "slot-001",
            submissionDate: new Date("2025-01-01T10:00:00Z"),
            completionDate: null,
            status: BookingStatus.PENDING,
            faultDescription: "Brake issue",
            workDescription: null,
        },
        {
            id: "mock-booking-2",
            workshopId: "workshop-123",
            userId: "user-789",
            vehicleId: "vehicle-456",
            serviceIds: ["service-3"],
            employeeId: "employee-102",
            timeSlotId: "slot-002",
            submissionDate: new Date("2025-01-02T14:00:00Z"),
            completionDate: null,
            status: BookingStatus.CONFIRMED,
            faultDescription: "Oil change",
            workDescription: null,
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
            timeSlotId: form.timeSlotId,
            submissionDate: new Date(),
            completionDate: null,
            status: BookingStatus.PENDING,
            faultDescription: form.faultDescription,
            workDescription: null,
        };
        this.bookings.push(newBooking);
        return newBooking;
    }

    async update(form: EditBookingForm): Promise<BookingDto> {
        const booking = this.bookings.find(b => b.id === form.bookingId);
        if (!booking) {
            throw new Error("Booking not found");
        }
        if (form.newDate) booking.submissionDate = form.newDate;
        if (form.workDescription) booking.workDescription = form.workDescription;
        if (form.status) booking.status = form.status;
        return booking;
    }

    async cancel(id: string): Promise<void> {
        const booking = this.bookings.find(b => b.id === id);
        if (!booking) {
            throw new Error("Booking not found");
        }
        booking.status = BookingStatus.CANCELED;
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

    async updateBookingStatus(id: string, newStatus: BookingStatus): Promise<void> {
        const booking = this.bookings.find(b => b.id === id);
        if (!booking) {
            throw new Error("Booking not found");
        }
        booking.status = newStatus;
        if (newStatus === BookingStatus.COMPLETED) {
            booking.completionDate = new Date();
        }
    }

    async search(form: SearchForm): Promise<SearchResponse<BookingDto>> {
        let filteredBookings = [...this.bookings];

        form.criteria.forEach((criterion) => {
            const { fieldName, value, operator } = criterion;

            filteredBookings = filteredBookings.filter((booking) => {
                const bookingValue = (booking as any)[fieldName];

                switch (operator) {
                    case CriteriaOperator.EQUALS:
                        return bookingValue === value;
                    case CriteriaOperator.NOT_EQUALS:
                        return bookingValue !== value;
                    case CriteriaOperator.GR:
                        return bookingValue > value;
                    case CriteriaOperator.GRE:
                        return bookingValue >= value;
                    case CriteriaOperator.LS:
                        return bookingValue < value;
                    case CriteriaOperator.LSE:
                        return bookingValue <= value;
                    case CriteriaOperator.LIKE:
                        return typeof bookingValue === "string" && bookingValue.includes(value);
                    default:
                        return false;
                }
            });
        });

        filteredBookings.sort((a, b) => {
            const aValue = (a as any)[form.sort.by];
            const bValue = (b as any)[form.sort.by];

            if (form.sort.order === "ASC") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        const start = form.page * form.size;
        const end = start + form.size;
        const paginatedBookings = filteredBookings.slice(start, end);

        return {
            items: paginatedBookings,
            total: filteredBookings.length,
        };
    }
}
