export interface TimeSlotDto {
    id: string;
    workshopId: string;
    employeeId: string;
    startDateTime: string;
    endDateTime: string;
    status: TimeSlotStatus;
}

export enum TimeSlotStatus {
    AVAILABLE = "AVAILABLE",
    RESERVED = "RESERVED",
    BLOCKED = "BLOCKED"
}