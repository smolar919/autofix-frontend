import {CreateUserForm} from "../../user-management/form/CreateUserForm";

export interface CreateUserWithPasswordForm extends CreateUserForm{
    password: string;
}