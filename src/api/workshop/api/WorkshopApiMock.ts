import { WorkshopApi } from "../WorkshopApi";
import { WorkshopDto } from "../response/WorkshopDto";
import { SearchForm } from "../../../commons/search/SearchForm";
import { SearchResponse } from "../../../commons/search/SearchResponse";
import { CriteriaOperator } from "../../../commons/search/CriteriaOperator";
import { CreateWorkshopForm } from "../form/CreateWorkshopForm";
import { EditWorkshopForm } from "../form/EditWorkshopForm";
import { v4 as uuidv4 } from 'uuid';

export class WorkshopApiMock implements WorkshopApi {
    private workshops: WorkshopDto[] = [
        {
            id: "mock-workshop-1",
            ownerId: "owner-1",
            name: "AutoFix Center",
            address: {
                id: "address-1",
                street: "123 Main St",
                city: "Springfield",
                postalCode: "12345",
                voivodeship: "Example Voivodeship",
                country: "Countryland",
            },
            employees: [
                {
                    id: "employee-1",
                    firstName: "John",
                    lastName: "Doe",
                    position: "Mechanic",
                    phoneNumber: "123-456-7890",
                    email: "john.doe@example.com",
                    workshopId: "mock-workshop-1",
                    userId: "user-1"
                },
            ],
            isVisible: true,
            description: "Profesjonalny warsztat z wieloletnim doświadczeniem.",
            serviceIds: ["service-1", "service-2"],
            openingHours: "Pon-Pt: 8:00-18:00; Sob: 9:00-13:00"
        },
    ];

    async search(form: SearchForm): Promise<SearchResponse<WorkshopDto>> {
        const filtered = this.workshops.filter(workshop => {
            return form.criteria.every(criteria => {
                const value = (workshop as any)[criteria.fieldName];
                switch (criteria.operator) {
                    case CriteriaOperator.EQUALS:
                        return value === criteria.value;
                    case CriteriaOperator.NOT_EQUALS:
                        return value !== criteria.value;
                    case CriteriaOperator.LIKE:
                        return typeof value === "string" && value.includes(criteria.value);
                    default:
                        return false;
                }
            });
        });

        const start = form.page * form.size;
        const end = start + form.size;
        const items = filtered.slice(start, end);

        return {
            items,
            total: filtered.length,
        };
    }

    async create(form: CreateWorkshopForm): Promise<WorkshopDto> {
        const newWorkshop: WorkshopDto = {
            id: uuidv4(),
            ownerId: form.ownerId,
            name: form.name,
            address: {
                id: uuidv4(),
                street: form.street,
                city: form.city,
                postalCode: form.postalCode,
                voivodeship: form.voivodeship,
                country: form.country,
            },
            employees: [],
            isVisible: true,
            description: form.description,
            serviceIds: [], // Jeśli pole nie jest obsługiwane, zostaje puste
            openingHours: form.openingHours
        };
        this.workshops.push(newWorkshop);
        return newWorkshop;
    }

    async edit(id: string, form: EditWorkshopForm): Promise<WorkshopDto> {
        const workshop = this.workshops.find(w => w.id === id);
        if (!workshop) {
            throw new Error("Workshop not found");
        }
        workshop.name = form.name;
        workshop.address.street = form.street;
        workshop.address.city = form.city;
        workshop.address.postalCode = form.postalCode;
        workshop.address.voivodeship = form.voivodeship;
        workshop.address.country = form.country;
        workshop.description = form.description;
        workshop.openingHours = form.openingHours;
        return workshop;
    }

    async delete(id: string): Promise<void> {
        this.workshops = this.workshops.filter(w => w.id !== id);
    }

    async get(id: string): Promise<WorkshopDto> {
        const workshop = this.workshops.find(w => w.id === id);
        if (!workshop) {
            throw new Error("Workshop not found");
        }
        return workshop;
    }
}
