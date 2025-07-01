import { ActivationStateEnum } from "../../Enums/Activation.State.Enum";

export const mapStatus = (status: number): string | undefined => {
    if (!status) return undefined;
    return status === ActivationStateEnum.Active ? 'activo' : 'inactivo';
}