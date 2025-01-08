import {ChangePasswordApi} from "../ChangePasswordApi";
import {ChangePasswordForm} from "../form/ChangePasswordForm";
import {axiosInstance} from "../../../AxiosClient";

export class ChangePasswordApiAxios implements ChangePasswordApi {
    async changePassword(form: ChangePasswordForm): Promise<void> {
        try {
            await axiosInstance.put('/password/change-password', form);
        } catch (error) {
            return console.error(error);
        }

    }

}