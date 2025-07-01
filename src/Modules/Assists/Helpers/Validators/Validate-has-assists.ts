import { Assists } from "../../Models/Assists.models";

export const ValidateHasAssists = (assists: Assists): boolean => {
    return !assists.hasErrors() || assists.Items.length > 0
}