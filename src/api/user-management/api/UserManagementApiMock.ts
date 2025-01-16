import { CreateUserForm } from "../form/CreateUserForm";
import { EditUserForm } from "../form/EditUserForm";
import {Role, UserDto} from "../response/UserDto";
import { UserManagementApi } from "../UserManagementApi";
import { mockTimeout } from "../../ApiUtils";
import { SearchResponse } from "../../../commons/search/SearchResponse";
import { SearchForm } from "../../../commons/search/SearchForm";
import { CriteriaOperator } from "../../../commons/search/CriteriaOperator";
import { SearchSortOrder } from "../../../commons/search/SearchSortOrder";

export class UserManagementApiMock implements UserManagementApi {
    private users: UserDto[] = [
        {
            id: "12312",
            firstName: "Jan",
            lastName: "Kowalski",
            email: "jan.kowalski@gmail.com",
            createdOn: new Date(),
            deletedOn: null,
            deletedById: null,
            blocked: false,
            role: Role.CUSTOMER,
        },
        {
            id: "12313",
            firstName: "Piotr",
            lastName: "Nowak",
            email: "piotr.nowak@gmail.com",
            createdOn: new Date(),
            deletedOn: null,
            deletedById: null,
            blocked: false,
            role: Role.ADMIN,
        },
        {
            id: "12314",
            firstName: "Jakub",
            lastName: "Józwik",
            email: "jakub.jozwik@gmail.com",
            createdOn: new Date(),
            deletedOn: null,
            deletedById: null,
            blocked: true,
            role: Role.PROVIDER,
        },
    ];

    async get(id: string): Promise<UserDto> {
        await mockTimeout(2000);
        const user = this.users.find((u) => u.id === id);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }

    async save(form: CreateUserForm): Promise<UserDto> {
        await mockTimeout(2000);
        const newUser: UserDto = {
            id: String(Date.now()),
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            createdOn: new Date(),
            deletedOn: null,
            deletedById: null,
            blocked: false,
            role: Role.CUSTOMER,
        };
        this.users.push(newUser);
        return newUser;
    }

    async update(form: EditUserForm): Promise<UserDto> {
        await mockTimeout(2000);
        const index = this.users.findIndex((u) => u.id === form.id);
        if (index === -1) {
            throw new Error("User not found");
        }
        this.users[index] = { ...this.users[index], ...form };
        return this.users[index];
    }

    async block(id: string): Promise<UserDto> {
        await mockTimeout(2000);
        const user = this.users.find((u) => u.id === id);
        if (!user) {
            throw new Error("User not found");
        }
        user.blocked = true;
        return user;
    }

    async unblock(id: string): Promise<UserDto> {
        await mockTimeout(2000);
        const user = this.users.find((u) => u.id === id);
        if (!user) {
            throw new Error("User not found");
        }
        user.blocked = false;
        return user;
    }

    async delete(id: string): Promise<void> {
        await mockTimeout(2000);
        const index = this.users.findIndex((u) => u.id === id);
        if (index === -1) {
            throw new Error("User not found");
        }
        this.users.splice(index, 1);
    }

    async search(form: SearchForm): Promise<SearchResponse<UserDto>> {
        await mockTimeout(2000);

        const filteredUsers = this.users.filter((user) => {
            return form.criteria.every((criteria) => {
                const value = user[criteria.fieldName as keyof UserDto];
                switch (criteria.operator) {
                    case CriteriaOperator.EQUALS:
                        return value === criteria.value;
                    case CriteriaOperator.LIKE:
                        return typeof value === "string" && value.includes(criteria.value);
                    case CriteriaOperator.NOT_EQUALS:
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
                return form.sort.order === SearchSortOrder.ASC
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            return form.sort.order === SearchSortOrder.ASC ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
        });

        const paginatedUsers = sortedUsers.slice(form.page * form.size, (form.page + 1) * form.size);

        return {
            items: paginatedUsers,
            total: filteredUsers.length,
        };
    }
}
