import {LoginPassAuthApi} from "../LoginPassAuthApi";
import {LoginForm} from "../form/LoginForm";
import {LoginResponseDto} from "../response/LoginResponseDto";
import {CreateUserWithPasswordForm} from "../form/CreateUserWithPasswordForm";
import {ResetPasswordForm} from "../form/ResetPasswordForm";
import {ResetPasswordConfirmForm} from "../form/ResetPasswordConfirmForm";
import {axiosInstance} from "../../../AxiosClient";

export class LoginPassAuthApiAxios implements LoginPassAuthApi {
    async login(form: LoginForm): Promise<LoginResponseDto> {
        const response = await axiosInstance.post<LoginResponseDto>('/auth/login', form);
        return response.data;
    }

    async register(form: CreateUserWithPasswordForm): Promise<void> {
        await axiosInstance.post('/auth/register', form);
    }

    async resetPasswordRequest(form: ResetPasswordForm): Promise<void> {
        await axiosInstance.post('/auth/reset-password-request', form);
    }

    async resetPassword(form: ResetPasswordConfirmForm): Promise<void> {
        await axiosInstance.put('/auth/reset-password', form);
    }

    async logout(): Promise<void> {
        await axiosInstance.post('/auth/logout');
    }
}