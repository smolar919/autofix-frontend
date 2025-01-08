export interface CreateBookingForm {
    workshopId: string;
    userId: string;
    vehicleId: string;
    serviceIds: string[];
    employeeId: string;
    bookingDate: Date;
}