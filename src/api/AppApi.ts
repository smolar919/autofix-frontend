import {UserManagementApi} from "./user-management/UserManagementApi.ts";
import {UserManagementApiAxios} from "./user-management/api/UserManagementApiAxios.ts";
import {LoginPassAuthApi} from "./login-pass-auth/LoginPassAuthApi.ts";
import {LoginPassAuthApiAxios} from "./login-pass-auth/api/LoginPassAuthApiAxios.ts";
import {LoginPassAuthApiMock} from "./login-pass-auth/api/LoginPassAuthApiMock.ts";
import {UserManagementApiMock} from "./user-management/api/UserManagementApiMock.ts";
import {ChangePasswordApi} from "./login-pass-auth/ChangePasswordApi.ts";
import {ChangePasswordApiAxios} from "./login-pass-auth/api/ChangePasswordApiAxios.ts";
import {ChangePasswordApiMock} from "./login-pass-auth/api/ChangePasswordApiMock.ts";
import {ServiceApi} from "./service/ServiceApi.ts";
import {ServiceApiAxios} from "./service/api/ServiceApiAxios.ts";
import {ServiceApiMock} from "./service/api/ServiceApiMock.ts";
import {BookingApi} from "./booking/BookingApi.ts";
import {BookingApiAxios} from "./booking/api/BookingApiAxios.ts";
import {BookingApiMock} from "./booking/api/BookingApiMock.ts";
import {WorkshopApi} from "./workshop/WorkshopApi.ts";
import {EmployeeApi} from "./workshop/EmployeeApi.ts";
import {WorkshopApiAxios} from "./workshop/api/WorkshopApiAxios.ts";
import {EmployeeApiAxios} from "./workshop/api/EmployeeApiAxios.ts";
import {WorkshopApiMock} from "./workshop/api/WorkshopApiMock.ts";
import {EmployeeApiMock} from "./workshop/api/EmployeeApiMock.ts";
import {VehicleApi} from "./vehicle/VehicleApi.ts";
import {VehicleApiAxios} from "./vehicle/api/VehicleApiAxios.ts";
import {VehicleApiMock} from "./vehicle/api/VehicleApiMock.ts";

interface AppApi {
    userManagement: UserManagementApi;
    loginPassAuth: LoginPassAuthApi;
    changePassword: ChangePasswordApi;
    service: ServiceApi;
    booking: BookingApi;
    workshop: WorkshopApi;
    employee: EmployeeApi;
    vehicle: VehicleApi;
}

const axiosApi: AppApi = {
    userManagement: new UserManagementApiAxios(),
    loginPassAuth: new LoginPassAuthApiAxios(),
    changePassword: new ChangePasswordApiAxios(),
    service: new ServiceApiAxios(),
    booking: new BookingApiAxios(),
    workshop: new WorkshopApiAxios(),
    employee: new EmployeeApiAxios(),
    vehicle: new VehicleApiAxios(),
}

const mockApi: AppApi = {
    userManagement: new UserManagementApiMock(),
    loginPassAuth: new LoginPassAuthApiMock(),
    changePassword: new ChangePasswordApiMock(),
    service: new ServiceApiMock(),
    booking: new BookingApiMock(),
    workshop: new WorkshopApiMock(),
    employee: new EmployeeApiMock(),
    vehicle: new VehicleApiMock(),
}

const isProd = true;

const api = isProd ? axiosApi : mockApi;
export {
    api
};