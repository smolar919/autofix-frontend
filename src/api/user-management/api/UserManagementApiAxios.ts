import { CreateUserForm } from "../form/CreateUserForm";
import { EditUserForm } from "../form/EditUserForm";
import { UserDto } from "../response/UserDto";
import {UserManagementApi} from "../UserManagementApi";
import {axiosInstance} from "../../../AxiosClient";
import {SearchForm} from "../../../commons/search/SearchForm.ts";
import {SearchResponse} from "../../../commons/search/SearchResponse.ts";

export class UserManagementApiAxios implements UserManagementApi {
    async get(id: string): Promise<UserDto> {
        const response = await axiosInstance.get<UserDto>(`/user-management/${id}`);
        return response.data;
    }
    async save(form: CreateUserForm): Promise<UserDto> {
        const response = await axiosInstance.post<UserDto>(`/user-management/save`, form);
        return response.data;
    }
    async update(form: EditUserForm): Promise<UserDto> {
        const response = await axiosInstance.put<UserDto>(`/user-management/update`, form);
        return response.data;
    }
    async block(id: string): Promise<UserDto> {
        const response = await axiosInstance.put<UserDto>(`/user-management/block/${id}`);
        return response.data;
    }
    async unblock(id: string): Promise<UserDto> {
        const response = await axiosInstance.put<UserDto>(`/user-management/unblock/${id}`);
        return response.data;
    }
    async delete(id: string): Promise<void> {
        try {
            await axiosInstance.delete(`/user-management/delete/${id}`);
        } catch (error) {
            return console.error(error);
        }}
    async search(form: SearchForm): Promise<SearchResponse<UserDto>> {
        const response = await axiosInstance.post<SearchResponse<UserDto>>(`/user-management/search`, form);
        return response.data;
    }
}