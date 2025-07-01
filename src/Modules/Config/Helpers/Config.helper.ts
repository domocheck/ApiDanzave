import { getTeachersByStatus } from "../../Accounts/Repository/Accounts.repository"
import { getStudentsByStatus } from "../../Students/Repository/StudentsRepository"

export const checkIsPriceUsedByStudent = async (priceId: string): Promise<boolean> => {
    return (await getStudentsByStatus('activo')).some(s => s.monthly === priceId)
}

export const checkIsPriceUsedByTeacher = async (priceId: string): Promise<boolean> => {
    return (await getTeachersByStatus('activo')).some(s => s.monthly === priceId)
}