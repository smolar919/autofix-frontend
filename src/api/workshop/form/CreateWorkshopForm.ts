export interface CreateWorkshopForm {
    name: string;
    street: string;
    city: string;
    postalCode: string;
    voivodeship: string;
    country: string;
    ownerId: string;
    ownerPhoneNumber: string;
    description: string;
    openingHours: string;
    serviceIds: string[];
}