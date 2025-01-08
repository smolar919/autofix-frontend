export interface BookingDto {
    id: string;
    workshopId: string;
    userId: string;
    vehicleId: string;
    serviceIds: string[];
    employeeId: string;
    bookingDate: Date;
    bookingStatus: BookingStatus;
}

export enum BookingStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELED = 'CANCELED',
    COMPLETED = 'COMPLETED',
    REJECTED = 'REJECTED',
    EXPIRED = 'EXPIRED',
    IN_PROGRESS = 'IN_PROGRESS',
    FAILED = 'FAILED',
}