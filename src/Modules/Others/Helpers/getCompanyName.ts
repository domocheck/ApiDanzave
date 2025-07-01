import { CompanyNameSingleton } from "../Models/Companies";

export const getCompanyName = (): string => {
    return CompanyNameSingleton.getInstance().getCompanyName();
}