import {ChangePasswordApi} from "../ChangePasswordApi";
import {ChangePasswordForm} from "../form/ChangePasswordForm";
import {mockTimeout} from "../../ApiUtils";

export class ChangePasswordApiMock implements ChangePasswordApi {
    async changePassword(form: ChangePasswordForm): Promise<void> {
        await mockTimeout(2000);
        console.log("Password changed successfully", form);
    }

}