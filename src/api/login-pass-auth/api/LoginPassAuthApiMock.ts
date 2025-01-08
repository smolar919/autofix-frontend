import {LoginPassAuthApi} from "../LoginPassAuthApi";
import {LoginResponseDto} from "../response/LoginResponseDto";
import {mockTimeout} from "../../ApiUtils";
import {LoginForm} from "../form/LoginForm";
import {CreateUserWithPasswordForm} from "../form/CreateUserWithPasswordForm";
import {ResetPasswordForm} from "../form/ResetPasswordForm";
import {ResetPasswordConfirmForm} from "../form/ResetPasswordConfirmForm";

export class LoginPassAuthApiMock implements LoginPassAuthApi {
    // @ts-ignore
    async login(form: LoginForm): Promise<LoginResponseDto> {
        await mockTimeout(2000);
        return ({
            token: "TOKEN",
            type: "TYPE",
        });
    }
    async register(form: CreateUserWithPasswordForm): Promise<void> {
        await mockTimeout(2000);
        console.log("User registered successfully", form);
    }
    async resetPasswordRequest(form: ResetPasswordForm): Promise<void> {
        await mockTimeout(2000);
        console.log("Password reset request sent successfully", form);
    }
    async resetPassword(form: ResetPasswordConfirmForm): Promise<void> {
        await mockTimeout(2000);
        console.log("Password reset successfully", form);
    }

    async logout(): Promise<void> {
        await mockTimeout(2000);
    }
}