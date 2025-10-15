import { format } from "@formkit/tempo";
import { db } from "../../../Firebase/firebase";
import { getCompanyName } from "../../Others/Helpers/getCompanyName";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { AssistPerson, Assists, IAssists } from "../Models/Assists.models";
import { v4 as uuidv4 } from 'uuid';
import { getPersonWhitDebt, updateAccountTeacherService } from "../../Accounts/Service/Accounts.service";
import { IPagedListHistoryAssistsPerson, PagedListHistoryAssistsPersons, SearchPagedListHistoryAssistsPersons } from "../Models/Assists.-students-paged-list.model";
import { getFullNameStudentById } from "../../Students/Repository/StudentsRepository";
import { getClassByIdRepository } from "../../Classes/Repository/Classes.repository";
import { getLimit } from "../../Config/Repository/Config.repository";
import { getFullNameTeacherById } from "../../Teachers/Repository/Teachers.repository";
import { getFullNameContactById } from "../../Contacts/Repository/Contacts.repository";
import { getAssistsModel } from "../../../mongo/schemas/assists.schema";


export const getAssistsByClassId = async (classId: string): Promise<Assists> => {
    const response = new Assists();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const assistsModel = getAssistsModel(companyName);

        const assist = await assistsModel.findOne({ idClass: classId });

        if (!assist) {
            response.setError("Asistencia no encontrada");
            return response;
        }

        response.Items = [assist];
        return response;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        response.setError("Error interno del servidor");
        return response;
    }
};

export const getAssistsByPersonId = async (personId: string): Promise<Assists> => {
    const response = new Assists();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const assistsModel = getAssistsModel(companyName);

        const assistsData = await assistsModel.find({ idPerson: personId });

        if (!assistsData || assistsData.length === 0) {
            response.setError("Asistencia no encontrada");
            return response;
        }

        response.Items = assistsData.filter((as: IAssists) => {
            return as.absent.includes(personId) ||
                as.disease.includes(personId) ||
                as.missing.includes(personId) ||
                as.presents.includes(personId) ||
                as.proofClass.includes(personId)
        });

        if (response.Items.length === 0) {
            response.setWarning("No se encontraron asistencias para esta clase");
            return response;
        }

        return response;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        response.setError("Error interno del servidor");
        return response;
    }
};

export const getAssistById = async (assistId: string): Promise<IAssists> => {
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const assistsModel = getAssistsModel(companyName);

        let assist = await assistsModel.findOne({ id: assistId });

        if (!assist) {
            return {} as IAssists;
        }

        return assist
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
};

export const getAssistsByDateRepository = async (date: Date): Promise<IAssists[]> => {
    let response = [] as IAssists[];
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const dateSearch = format(date, 'full');

        const assistsModel = getAssistsModel(companyName);

        const assistsData = await assistsModel.find({ date: dateSearch });

        if (!assistsData || assistsData.length === 0) {
            return response;
        }

        return assistsData;

    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
};

export const getAssistsRepository = async (): Promise<IAssists[]> => {
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const assistsModel = getAssistsModel(companyName);

        const assistsData = await assistsModel.find();

        return assistsData;

    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
};

export const getAssistsByTeacherIdAndClassRepository = async (teacherId: string): Promise<IAssists[]> => {
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const assistsModel = getAssistsModel(companyName);

        const assist = await assistsModel.find({
            idTeacher: teacherId,
            idClass: { $ne: null }   // idClass != null
        });

        if (!assist) {
            return [];
        }

        // Obtener solo la propiedad 'assists' del documento
        return assist

    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
};

export const checkIsGenerateAssist = async (classId: string, date: string): Promise<boolean> => {
    let response = false;
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const assistsModel = getAssistsModel(companyName);

        const assist = await assistsModel.find({ idClass: classId });

        response = assist?.length === 0 || true;

        return response;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        return response;
    }
};

export const addAssistRepository = async (idClass: string): Promise<ResponseMessages> => {
    const response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const assistsModel = getAssistsModel(companyName);

        const newAssist = new assistsModel({
            id: uuidv4(),
            idClass: idClass,
            date: format(new Date(), 'full'),
            presents: [],
            missing: [],
            absent: [],
            disease: [],
            proofClass: [],
            idTeacher: '',
        });

        newAssist._id = newAssist.id;

        await newAssist.save();

        response.setSuccess("asistencia guardada con éxito");
        return response;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        response.setError("Error interno del servidor");
        return response;
    }
}

export const chargePresencesRepository = async (newAssist: AssistPerson): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const assistsModel = getAssistsModel(companyName);

        // Buscar el registro base
        const currentAssists = await assistsModel.findOne({ id: newAssist.idAssist });
        if (!currentAssists) {
            response.setError("Asistencia no encontrada");
            return response;
        }

        // ====== 1️⃣ Lógica de profesor / sustituto ======
        const updateData: any = {};

        if (newAssist.type === 'teacher') {
            if (newAssist.idPersonSustitute) {
                updateData.idTeacher = newAssist.idPerson;
                updateData.idTeacherSustitute = newAssist.idPersonSustitute;
            } else {
                updateData.idTeacher = newAssist.idPerson;
                updateData.idTeacherSustitute = '';
            }

            if (newAssist.status !== 'presents') {
                const personsWithDebt = await getPersonWhitDebt(newAssist.status);
                const substituteAccount = personsWithDebt?.find(p => p.idPerson === newAssist.idPersonSustitute)?.accounts[0];
                const teacherAccount = personsWithDebt?.find(p => p.idPerson === newAssist.idPerson)?.accounts[0];

                if (teacherAccount) {
                    await updateAccountTeacherService(teacherAccount.id, newAssist.idPerson, 'decrease');
                }
                if (substituteAccount) {
                    await updateAccountTeacherService(substituteAccount.id, newAssist.idPersonSustitute!, 'increase');
                }
            }
        }

        // ====== 2️⃣ Limpiar las asistencias previas ======
        const updatesToArrays: Record<string, string[]> = {};
        for (const key of Object.keys(currentAssists.toObject())) {
            if (Array.isArray((currentAssists as any)[key]) && key !== newAssist.status && key !== 'recovers') {
                updatesToArrays[key] = (currentAssists as any)[key].filter((id: string) => id !== newAssist.idPerson);
            }
        }

        // ====== 3️⃣ Agregar id al array correcto ======
        const currentStatusArray = (currentAssists as any)[newAssist.status] || [];
        if (!currentStatusArray.includes(newAssist.idPerson)) {
            updatesToArrays[newAssist.status] = [...currentStatusArray, newAssist.idPerson];
        }

        // Combinar los updates
        const finalUpdate = { ...updateData, ...updatesToArrays };

        // ====== 4️⃣ Actualizar en un solo paso ======
        await assistsModel.findOneAndUpdate(
            { id: newAssist.idAssist },
            { $set: finalUpdate },
            { new: true }
        );

        response.setSuccess("Asistencia cargada con éxito");
    } catch (error: any) {
        console.error("Error obteniendo asistencias:", error);
        response.setError("Error interno del servidor");
    }

    return response;
};

export const getAssistsByStudentId = async (studentId: string): Promise<IAssists[]> => {
    const companyName = getCompanyName();
    if (!companyName) throw new Error("Company name is not set");

    const assistsModel = getAssistsModel(companyName); // tu modelo Mongoose

    // Creamos un filtro con $or para todos los arrays
    const filter = {
        $or: [
            { presents: studentId },
            { missing: studentId },
            { absent: studentId },
            { disease: studentId },
            { proofClass: studentId },
        ]
    };

    const assistsDocs = await assistsModel.find(filter);

    if (!assistsDocs || assistsDocs.length === 0) {
        throw new Error("No se encontraron asistencias");
    }

    // Mapeamos para mantener la propiedad id (en Mongoose es _id)
    const results: IAssists[] = assistsDocs.map(doc => ({
        ...doc.toObject(),
        id: doc.id
    }));

    return results;
};


export const getAssistsByTeacherId = async (teacherId: string): Promise<IAssists[]> => {
    const companyName = getCompanyName();
    if (!companyName) throw new Error("Company name is not set");

    const assistsModel = getAssistsModel(companyName); // tu modelo Mongoose

    // Creamos un filtro con $or para todos los arrays
    const filter = {
        $or: [
            { presents: teacherId },
            { missing: teacherId },
            { absent: teacherId },
            { disease: teacherId },
            { proofClass: teacherId },
        ]
    };

    const assistsDocs = await assistsModel.find(filter);

    if (!assistsDocs || assistsDocs.length === 0) {
        throw new Error("No se encontraron asistencias");
    }

    // Mapeamos para mantener la propiedad id (en Mongoose es _id)
    const results: IAssists[] = assistsDocs.map(doc => ({
        ...doc.toObject(),
        id: doc.id
    }));

    return results;
}

export const getAssistsTakenRepository = async (): Promise<IAssists[]> => {
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const assistsModel = getAssistsModel(companyName); // tu modelo Mongoose

        // Filtramos todos los documentos que tengan al menos un array no vacío
        const filter = {
            $or: [
                { presents: { $ne: [] } },
                { missing: { $ne: [] } },
                { absent: { $ne: [] } },
                { disease: { $ne: [] } },
                { proofClass: { $ne: [] } },
            ]
        };

        const assistsDocs = await assistsModel.find(filter);

        if (!assistsDocs || assistsDocs.length === 0) {
            throw new Error("No se encontraron asistencias");
        }

        // Convertimos a objetos planos y agregamos id
        const results: IAssists[] = assistsDocs.map(doc => ({
            ...doc.toObject(),
            id: doc.id
        }));

        return results;

    } catch (error: any) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error(error.message || "Error interno del servidor");
    }
};



export const getPagedListStudentAssistsRepository = async (search: SearchPagedListHistoryAssistsPersons): Promise<PagedListHistoryAssistsPersons> => {
    const response = new PagedListHistoryAssistsPersons();
    try {
        const nameStudent = await getFullNameStudentById(search.PersonId);
        const assists = await getAssistsByStudentId(search.PersonId);

        if (assists.length === 0) {
            return response;
        }

        let uniqueClassesId = Array.from(new Set(assists.map((a) => a.idClass)));
        let classesPromise = uniqueClassesId.map(async (id) => await getClassByIdRepository(id));
        let classes = await Promise.all(classesPromise);

        let assist = assists.map((assist: IAssists) => {
            const classe = classes.find((c) => c.id === assist.idClass)!;
            const danceClasse = classe.dance;
            const assistByStudent = {} as IPagedListHistoryAssistsPerson;
            assistByStudent.date = assist.date;
            assistByStudent.namePerson = nameStudent;
            assistByStudent.danceClasse = danceClasse;
            assistByStudent.classId = assist.idClass;
            if (assist.absent.includes(search.PersonId)) {
                assistByStudent.status = 'ausente sin aviso';
            }
            if (assist.disease.includes(search.PersonId)) {
                assistByStudent.status = 'por enfermedad';
            }
            if (assist.presents.includes(search.PersonId)) {
                assistByStudent.status = 'presentes';
            }
            if (assist.proofClass.includes(search.PersonId)) {
                assistByStudent.status = 'clase de prueba';
            }
            if (assist.missing.includes(search.PersonId)) {
                assistByStudent.status = 'ausente con aviso';
            }
            return assistByStudent;
        });

        if (search.Assist && search.Assist !== 'all') {
            assist = assist.filter((assist: IPagedListHistoryAssistsPerson) => assist.status.toLowerCase() === search.Assist.toLowerCase());
        }

        const page = search.Page;
        const limit = await getLimit();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedAssist = assist.slice(startIndex, endIndex);

        response.Items = paginatedAssist;
        response.TotalItems = assist.length;
        response.PageSize = limit;
        response.NamePerson = nameStudent;
        return response;
    } catch (error) {
        console.error("Error obteniendo clases:", error);
        response.setError("Error interno del servidor");
        return response;
    }
}

export const getPagedListTeacherAssistsRepository = async (search: SearchPagedListHistoryAssistsPersons): Promise<PagedListHistoryAssistsPersons> => {
    const response = new PagedListHistoryAssistsPersons();
    try {
        const nameTeacher = await getFullNameTeacherById(search.PersonId);
        const assists = await getAssistsByTeacherId(search.PersonId);

        if (assists.length === 0) {
            return response;
        }
        let uniqueClassesId = Array.from(new Set(assists.map((a) => a.idClass)));
        let classesPromise = uniqueClassesId.map(async (id) => await getClassByIdRepository(id));
        let classes = await Promise.all(classesPromise);

        let assist = assists.map((assist: IAssists) => {
            const classe = classes.find((c) => c.id === assist.idClass)!;
            const danceClasse = classe.dance;
            const assistByStudent = {} as IPagedListHistoryAssistsPerson;
            assistByStudent.date = assist.date;
            assistByStudent.namePerson = nameTeacher;
            assistByStudent.danceClasse = danceClasse;
            assistByStudent.classId = assist.idClass;
            if (assist.absent.includes(search.PersonId)) {
                assistByStudent.status = 'ausente sin aviso';
            }
            if (assist.disease.includes(search.PersonId)) {
                assistByStudent.status = 'por enfermedad';
            }
            if (assist.presents.includes(search.PersonId)) {
                assistByStudent.status = 'presentes';
            }
            if (assist.proofClass.includes(search.PersonId)) {
                assistByStudent.status = 'clase de prueba';
            }
            if (assist.missing.includes(search.PersonId)) {
                assistByStudent.status = 'ausente con aviso';
            }
            return assistByStudent;
        });


        if (search.Assist && search.Assist !== 'all') {
            assist = assist.filter((assist: IPagedListHistoryAssistsPerson) => assist.status.toLowerCase() === search.Assist.toLowerCase());
        }

        const page = search.Page;
        const limit = await getLimit();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedAssist = assist.slice(startIndex, endIndex);

        response.Items = paginatedAssist;
        response.TotalItems = assist.length;
        response.PageSize = limit;
        response.NamePerson = nameTeacher;
        return response;
    } catch (error) {
        console.error("Error obteniendo clases:", error);
        response.setError("Error interno del servidor");
        return response;
    }
}

export const getPagedListContactAssistsRepository = async (search: SearchPagedListHistoryAssistsPersons): Promise<PagedListHistoryAssistsPersons> => {
    const response = new PagedListHistoryAssistsPersons();
    try {
        const nameContact = await getFullNameContactById(search.PersonId);
        const assists = await getAssistsByTeacherId(search.PersonId);

        if (assists.length === 0) {
            return response;
        }

        let uniqueClassesId = Array.from(new Set(assists.map((a) => a.idClass)));
        let classesPromise = uniqueClassesId.map(async (id) => await getClassByIdRepository(id));
        let classes = await Promise.all(classesPromise);

        let assist = assists.map((assist: IAssists) => {
            const classe = classes.find((c) => c.id === assist.idClass)!;
            const danceClasse = classe.dance;
            const assistByStudent = {} as IPagedListHistoryAssistsPerson;
            assistByStudent.date = assist.date;
            assistByStudent.namePerson = nameContact;
            assistByStudent.danceClasse = danceClasse;
            assistByStudent.classId = assist.idClass;
            if (assist.absent.includes(search.PersonId)) {
                assistByStudent.status = 'ausente sin aviso';
            }
            if (assist.disease.includes(search.PersonId)) {
                assistByStudent.status = 'por enfermedad';
            }
            if (assist.presents.includes(search.PersonId)) {
                assistByStudent.status = 'presentes';
            }
            if (assist.proofClass.includes(search.PersonId)) {
                assistByStudent.status = 'clase de prueba';
            }
            if (assist.missing.includes(search.PersonId)) {
                assistByStudent.status = 'ausente con aviso';
            }
            return assistByStudent;
        });


        if (search.Assist && search.Assist !== 'all') {
            assist = assist.filter((assist: IPagedListHistoryAssistsPerson) => assist.status.toLowerCase() === search.Assist.toLowerCase());
        }

        const page = search.Page;
        const limit = await getLimit();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedAssist = assist.slice(startIndex, endIndex);

        response.Items = paginatedAssist;
        response.TotalItems = assist.length;
        response.PageSize = limit;
        response.NamePerson = nameContact;
        return response;
    } catch (error) {
        console.error("Error obteniendo clases:", error);
        response.setError("Error interno del servidor");
        return response;
    }
}
