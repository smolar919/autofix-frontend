export interface BookingDto {
    id: string;
    workshopId: string;
    userId: string;
    vehicleId: string;
    serviceIds: string[];
    employeeId: string;
    timeSlotId: string;
    submissionDate: Date | null;
    completionDate: Date | null;
    status: BookingStatus;
    faultDescription: string;
    workDescription: string | null;
}

export enum BookingStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    CANCELED = "CANCELLED",
    COMPLETED = "COMPLETED",
    REJECTED = "REJECTED",
    EXPIRED = "EXPIRED",
    IN_PROGRESS = "IN_PROGRESS",
    FAILED = "FAILED",
}