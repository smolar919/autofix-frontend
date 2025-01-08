import {ChangePasswordForm} from "./form/ChangePasswordForm";

export interface ChangePasswordApi {
    changePassword(form: ChangePasswordForm): Promise<void>;
}