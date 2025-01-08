import {LoginResponseDto} from "./response/LoginResponseDto";
import {LoginForm} from "./form/LoginForm";
import {CreateUserWithPasswordForm} from "./form/CreateUserWithPasswordForm";
import {ResetPasswordForm} from "./form/ResetPasswordForm";
import {ResetPasswordConfirmForm} from "./form/ResetPasswordConfirmForm";

export interface LoginPassAuthApi {
    login(form: LoginForm): Promise<LoginResponseDto>;
    register(form: CreateUserWithPasswordForm): Promise<void>;
    resetPasswordRequest(form: ResetPasswordForm): Promise<void>;
    resetPassword(form: ResetPasswordConfirmForm): Promise<void>;
    logout(): Promise<void>;
}