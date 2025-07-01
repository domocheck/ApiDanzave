import { Classes } from "../../Models/classes.models"

export const ValidateHasClasses = (classes: Classes): boolean => {
    return !classes.hasErrors() || classes.Items.length > 0
}