import {CreateUserForm} from "../form/CreateUserForm";
import {EditUserForm} from "../form/EditUserForm";
import {UserDto} from "../response/UserDto";
import {UserManagementApi} from "../UserManagementApi";
import {mockTimeout} from "../../ApiUtils";
import {SearchResponse} from "../../../commons/search/SearchResponse.ts";
import {SearchForm} from "../../../commons/search/SearchForm.ts";


export class UserManagementApiMock implements UserManagementApi {
    async get(id: string): Promise<UserDto> {
        await mockTimeout(2000);
        return ({
            id: id,
            firstName: "Jan",
            lastName: "Kowalski",
            email: "test@gmail.com",
            createdOn: new Date(),
            createdById: "111",
            deletedOn: null,
            deletedById: null,
            blocked: false
        });
    }
    async save(form: CreateUserForm): Promise<UserDto> {
        await mockTimeout(2000);
        return ({
            id: "12312",
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            createdOn: new Date(),
            createdById: "111",
            deletedOn: null,
            deletedById: null,
            blocked: false
        });
    }
    async update(form: EditUserForm): Promise<UserDto> {
        await mockTimeout(2000);
        return ({
            id: form.id,
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            createdOn: new Date(),
            createdById: "111",
            deletedOn: null,
            deletedById: null,
            blocked: false
        });
    }
    async block(id: string): Promise<UserDto> {
        await mockTimeout(2000);
        return ({
            id: id,
            firstName: "Jan",
            lastName: "Kowalski",
            email: "test@gmail.com",
            createdOn: new Date(),
            createdById: "111",
            deletedOn: null,
            deletedById: null,
            blocked: false
        });
    }
    async unblock(id: string): Promise<UserDto> {
        await mockTimeout(2000);
        return ({
            id: id,
            firstName: "Jan",
            lastName: "Kowalski",
            email: "test@gmail.com",
            createdOn: new Date(),
            createdById: "111",
            deletedOn: null,
            deletedById: null,
            blocked: false
        });
    }
    async delete(id: string): Promise<void> {
        await mockTimeout(2000);
        console.log("User deleted successfully", id);
    }
    async search(form: SearchForm): Promise<SearchResponse<UserDto>> {
        const users: UserDto[] = [
            {
                id: "12312",
                firstName: "Jan",
                lastName: "Kowalski",
                email: "test@gmail.com",
                createdOn: new Date(),
                createdById: "111",
                deletedOn: null,
                deletedById: null,
                blocked: false
            },
            {
                id: "12313",
                firstName: "Piotr",
                lastName: "Nowak",
                email: "bartosz.bedyk@gmail.com",
                createdOn: new Date(),
                createdById: "112",
                deletedOn: null,
                deletedById: null,
                blocked: false
            },
            {
                id: "12314",
                firstName: "Jakub",
                lastName: "Józwik",
                email: "kamil.smolarek@gmail.com",
                createdOn: new Date(),
                createdById: "113",
                deletedOn: null,
                deletedById: null,
                blocked: false
            },
        ]

        const filteredUsers = users.filter(user => {
            return form.criteria.every(criteria => {
                const value = user[criteria.fieldName as keyof UserDto];
                switch (criteria.operator) {
                    case "EQUALS":
                        return value === criteria.value;
                    case "LIKE":
                        return typeof value === "string" && value.includes(criteria.value);
                    case "NOT_EQUALS":
                        return value !== criteria.value;
                    default:
                        return true;
                }
            });
        });

        const sortedUsers = filteredUsers.sort((a, b) => {
            const aValue = a[form.sort.by as keyof UserDto];
            const bValue = b[form.sort.by as keyof UserDto];

            if (aValue == null || bValue == null) return 0;

            if (typeof aValue === "string" && typeof bValue === "string") {
                return form.sort.order === "ASC" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }

            return form.sort.order === "ASC" ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
        });

        const paginatedUsers = sortedUsers.slice(form.page * form.size, (form.page + 1) * form.size);

        await mockTimeout(2000);
        return ({
            items: paginatedUsers,
            total: filteredUsers.length
        });
    }
}