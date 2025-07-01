import { db } from "../../../Firebase/firebase";
import { getCompanyName } from "../../Others/Helpers/getCompanyName";
import { v4 as uuidv4 } from 'uuid';
import { ScheduleHours } from "../../Others/Models/Schedule"; import { getTeacherById, getTeachersActives } from "../../Teachers/Repository/Teachers.repository";
import { Config, IPayments, ItemsConfig, Price, Ranges, Reasons, Reference } from "../Models/Config.models";
import { User } from "../../Others/Models/Users";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { PaymentMethod } from './../../Drawers/Models/Drawer.models';
import { PagedListPrices, SearchPagedListPrices } from "../Models/Price-paged-list.model";
import { getStudentsAccountsByStatus } from "../../Accounts/Repository/Accounts.repository";
import { getStudentsByStatus } from "../../Students/Repository/StudentsRepository";
import { checkIsPriceUsedByStudent, checkIsPriceUsedByTeacher } from "../Helpers/Config.helper";
import { NameAndId } from "../../Others/Models/Others";

export const getConfigRepository = async (): Promise<Config> => {
    let response = new Config();
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("config");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let config = docSnap.data();

        if (!config) {
            return response;
        }
        response.Items = config;

        return response;
    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
}

export const getHoursFromConfigRepository = async (): Promise<ScheduleHours[]> => {
    let response = [] as ScheduleHours[];
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("config");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let configHours = docSnap.data()?.hours;

        if (!Array.isArray(configHours)) {
            return response;
        }
        response = configHours

        return response;
    } catch (error) {
        console.error("Error obteniendo horas:", error);
        return response;
    }
}

export const getExpirationDaysFromConfigRepository = async (): Promise<NameAndId[]> => {
    let response = [] as NameAndId[];
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("config");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        return docSnap.data()?.expirationDays ?? 30;

    } catch (error) {
        console.error("Error obteniendo horas:", error);
        return response;
    }
}

export const getRangesFromConfigRepository = async (): Promise<Ranges> => {
    let response = {} as Ranges;
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("config");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let configRanges = docSnap.data()?.ranges;

        if (!configRanges) {
            return response;
        }
        response = configRanges

        return response;
    } catch (error) {
        console.error("Error obteniendo rangos:", error);
        return response;
    }
}

export const getReasonsFromConfigRepository = async (): Promise<Reasons[]> => {
    let response = [] as Reasons[];
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("config");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let configReasons = docSnap.data()?.reasons;

        if (!configReasons) {
            return response;
        }
        response = configReasons

        return response;
    } catch (error) {
        console.error("Error obteniendo motivos de inactividad:", error);
        return response;
    }
}

export const getRolesFromConfigRepository = async (): Promise<string[]> => {
    let response = [] as string[];
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("config");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let configRoles = docSnap.data()?.roles;

        if (!configRoles) {
            return response;
        }
        response = configRoles

        return response;
    } catch (error) {
        console.error("Error obteniendo motivos de inactividad:", error);
        return response;
    }
}

export const getReferencesFromConfigRepository = async (): Promise<Reference[]> => {
    let response = [] as Reference[];
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("config");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let configReferences = docSnap.data()?.references;

        if (!configReferences) {
            return response;
        }
        response = configReferences

        return response;
    } catch (error) {
        console.error("Error obteniendo referencias:", error);
        return response;
    }
}

export const getContactsMediaFromConfigRepository = async (): Promise<Reference[]> => {
    let response = [] as Reference[];
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("config");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let configContactsMedia = docSnap.data()?.contactMedia;

        if (!configContactsMedia) {
            return response;
        }
        response = configContactsMedia

        return response;
    } catch (error) {
        console.error("Error obteniendo medios de contacto:", error);
        return response;
    }
}

export const getPaymentsMethodsFromConfigRepository = async (): Promise<IPayments[]> => {
    let response: IPayments[] = [];
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("config");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let paymentMethods = docSnap.data()?.paymentsMethods;

        if (!paymentMethods) {
            return response;
        }
        response = paymentMethods

        return response;
    } catch (error) {
        console.error("Error obteniendo rangos:", error);
        return response;
    }
}

export const getMontlyByTeacherId = async (teacherId: string): Promise<number> => {

    const teacherMontly = (await getTeacherById(teacherId)).monthly;

    let response = 0;
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("config");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let teachersPrice: Price[] = docSnap.data()?.teachersPrice;

        if (!teachersPrice) {
            return response;
        }
        response = teachersPrice.find(tp => tp.id === teacherMontly)?.regularPrice || 0

        return response;
    } catch (error) {
        console.error("Error obteniendo rangos:", error);
        return response;
    }

}

export const getCategoriesProductsFromConfigRepository = async (): Promise<ItemsConfig[]> => {
    let response = [] as ItemsConfig[];
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("config");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let configCategories = docSnap.data()?.categoriesProducts;

        if (!configCategories) {
            return response;
        }
        response = configCategories

        return response;
    } catch (error) {
        console.error("Error obteniendo motivos de inactividad:", error);
        return response;
    }
}

export const getSizesProductsFromConfigRepository = async (): Promise<ItemsConfig[]> => {
    let response = [] as ItemsConfig[];
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("config");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let configSizes = docSnap.data()?.sizesProducts;

        if (!configSizes) {
            return response;
        }
        response = configSizes

        return response;
    } catch (error) {
        console.error("Error obteniendo motivos de inactividad:", error);
        return response;
    }
}

export const getColorsProductsFromConfigRepository = async (): Promise<ItemsConfig[]> => {
    let response = [] as ItemsConfig[];
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("config");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let configColors = docSnap.data()?.colorsProducts;

        if (!configColors) {
            return response;
        }
        response = configColors

        return response;
    } catch (error) {
        console.error("Error obteniendo motivos de inactividad:", error);
        return response;
    }
}

export const getCategoryByIdFromConfigRepository = async (categoryId: string): Promise<ItemsConfig> => {
    let response = {} as ItemsConfig;
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("config");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let configCategories = docSnap.data()?.categoriesProducts.find((c: ItemsConfig) => c.id === categoryId);

        if (!configCategories) {
            return response;
        }
        response = configCategories

        return response;
    } catch (error) {
        console.error("Error obteniendo motivos de inactividad:", error);
        return response;
    }
}

export const getReasonByIdRepository = async (reasonId: string): Promise<Reasons> => {
    let response = {} as Reasons;
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("config");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let configReasons = docSnap.data()?.reasons.find((r: Reasons) => r.id === reasonId);

        if (!configReasons) {
            return response;
        }
        response = configReasons

        return response;
    } catch (error) {
        console.error("Error obteniendo rangos:", error);
        return response;
    }
}

export const getLimit = async (): Promise<number> => {
    let response = 10;
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("config");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let quantityPagesToSee = docSnap.data()?.quantityPagesToSee;

        if (!quantityPagesToSee) {
            return response;
        }
        response = quantityPagesToSee

        return response;
    } catch (error) {
        console.error("Error obteniendo pagiacion:", error);
        return response;
    }
}

export const getStudentsPricesRepository = async (): Promise<Price[]> => {
    let response: Price[] = [];
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("config");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let studentsPrice: Price[] = docSnap.data()?.studentsPrice.map((price: Price) => {
            return {
                ...price,
                displayName: `${price.name} - $${price.regularPrice}`,
            }
        })

        response = studentsPrice;
    } catch (error: any) {
        throw new Error(error.message);
    }

    return response;
}

export const getStudentsPricesByStatusRepository = async (status: string): Promise<Price[]> => {
    let response: Price[] = [];
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("config");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let studentsPrice: Price[] = docSnap.data()?.studentsPrice.filter((p: Price) => p.status === status).map((price: Price) => {
            return {
                ...price,
                displayName: `${price.name} - $${price.regularPrice}`,
            }
        })

        response = studentsPrice;
    } catch (error: any) {
        throw new Error(error.message);
    }

    return response;
}

export const getTeachersPricesRepository = async (): Promise<Price[]> => {
    let response: Price[] = [];
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("config");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let teachersPrice: Price[] = docSnap.data()?.teachersPrice.map((price: Price) => {
            return {
                ...price,
                displayName: `${price.name} - $${price.regularPrice}`,
            }
        })

        response = teachersPrice;
    } catch (error: any) {
        throw new Error(error.message);
    }

    return response;
}

export const getTeachersPricesByStatusRepository = async (status: string): Promise<Price[]> => {
    let response: Price[] = [];
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("config");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let teachersPrice: Price[] = docSnap.data()?.teachersPrice.filter((p: Price) => p.status === status).map((price: Price) => {
            return {
                ...price,
                displayName: `${price.name} - $${price.regularPrice}`,
            }
        })

        response = teachersPrice;
    } catch (error: any) {
        throw new Error(error.message);
    }

    return response;
}

export const checkAndSaveReference = async (referenceName: string): Promise<Reference> => {
    let response = {} as Reference;
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("config");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let configReferences = docSnap.data()?.references;

        if (!configReferences) {
            return response;
        }
        const currentReference = configReferences.find((r: Reference) => r.id === referenceName);
        if (!currentReference) {
            const newReference = {
                id: uuidv4(),
                name: referenceName,
            }
            configReferences.push(newReference);
            await docRef.update({
                references: configReferences
            })
            response = newReference;
        } else {
            response = currentReference
        }

        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }

}

export const checkAndSaveContactMedia = async (contactMediaName: string): Promise<Reference> => {
    let response = {} as Reference;
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("config");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let configContactsMedia = docSnap.data()?.contactMedia;

        if (!configContactsMedia) {
            return response;
        }
        const currentContactMedia = configContactsMedia.find((r: Reference) => r.id === contactMediaName);
        if (!currentContactMedia) {
            const newContactMedia = {
                id: uuidv4(),
                name: contactMediaName,
            }
            configContactsMedia.push(newContactMedia);
            await docRef.update({
                contactMedia: configContactsMedia
            })
            response = newContactMedia;
        } else {
            response = currentContactMedia
        }

        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }

}

export const getUsersFromConfigRepository = async (): Promise<User[]> => {
    let response = [] as User[];
    try {
        const docRef = db.collection('Users').doc("Users");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let configUsers = docSnap.data()?.users;

        if (!configUsers) {
            return response;
        }
        response = configUsers

        return response;
    } catch (error) {
        console.error("Error obteniendo usuarios:", error);
        return response;
    }
}

export const saveReferenceRepository = async (id: string, value: string, type: string): Promise<ResponseMessages> => {
    const response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("config");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el nombre");
        }

        const data: Reference[] = docSnap.data()?.[type] ?? [];

        if (!data) {
            response.setError("No se encontro el item");
            return response;
        }

        const index = data.findIndex((s: Reference) => s.id === id);

        if (index !== -1) {
            data.splice(index, 1, { name: value, id });
        } else {
            data.unshift({ name: value, id: uuidv4() });
        }

        await docRef.update({ [type]: data });
        response.setSuccess("Configuración actualizada correctamente");

    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
    return response
}

export const saveItemsToSeeRepository = async (quantity: number): Promise<ResponseMessages> => {
    const response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("config");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el nombre");
        }

        let quantityPagesToSee: number = docSnap.data()?.quantityPagesToSee;

        if (!quantityPagesToSee) {
            response.setError("No se encontro el item");
            return response;
        }

        quantityPagesToSee = quantity
        await docRef.update({ quantityPagesToSee });
        response.setSuccess("Configuración actualizada correctamente");


    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
    return response
}

export const savePaymentMethodRepository = async (paymentName: string, paymentId: string): Promise<ResponseMessages> => {
    const response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("config");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el nombre");
        }

        let paymentMethods: IPayments[] = docSnap.data()?.paymentsMethods;

        if (!paymentMethods) {
            response.setError("No se encontro el item");
            return response;
        }

        const index = paymentMethods.findIndex((s: IPayments) => s.id === paymentId);

        if (index !== -1) {
            paymentMethods.splice(index, 1, { name: paymentName, id: paymentId });
        } else {
            paymentMethods.unshift({ name: paymentName, id: uuidv4() });
        }

        await docRef.update({ paymentsMethods: paymentMethods });
        response.setSuccess("Configuración actualizada correctamente");

    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
    return response
}

export const saveRangeHoursRepository = async (index: number, initialHour: number, finalHour: number): Promise<ResponseMessages> => {
    const response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("config");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el nombre");
        }

        let hours: ScheduleHours[] = docSnap.data()?.hours;

        if (!hours) {
            response.setError("No se encontro el item");
            return response;
        }

        hours[index].initialHour = initialHour;
        hours[index].finalHour = finalHour;

        await docRef.update({ hours });
        response.setSuccess("Configuración actualizada correctamente");

    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
    return response
}

export const saveRangeStudentsRepository = async (value: number, range: keyof Ranges): Promise<ResponseMessages> => {
    const response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("config");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el nombre");
        }

        let ranges: Ranges = docSnap.data()?.ranges;

        if (!ranges) {
            response.setError("No se encontro el item");
            return response;
        }

        ranges[range] = value;

        await docRef.update({ ranges });
        response.setSuccess("Configuración actualizada correctamente");

    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
    return response
}

export const savePriceRepository = async (price: Price, type: string): Promise<ResponseMessages> => {
    const response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("config");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el nombre");
        }

        let pricesData: Price[] = docSnap.data()?.[type];

        if (!pricesData) {
            response.setError("No se encontro el item");
            return response;
        }

        const index = pricesData.findIndex((s: Price) => s.id === price.id);

        if (index !== -1) {
            pricesData.splice(index, 1, price);
        } else {
            pricesData.unshift(price);
        }

        await docRef.update({ [type]: pricesData });
        response.setSuccess("Configuración actualizada correctamente");

    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
    return response
}

export const getPagedListPricesRepository = async (search: SearchPagedListPrices): Promise<PagedListPrices> => {
    const response = new PagedListPrices();
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        const docRef = db.collection(companyName).doc("config");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            response.setError("No se encontraron configuraciones");
            return response;
        }

        let pricesData: Price[] = docSnap.data()?.[search.Type];

        if (!Array.isArray(pricesData)) {
            response.setError("No se encontraron precios válidos");
            return response;
        }
        if (search.Status && search.Status !== 'all') {
            pricesData = pricesData.filter((item: Price) => item.status === search.Status);
        }

        if (search.Name) {
            pricesData = pricesData.filter((item: Price) =>
                item.name.toLowerCase().includes(search.Name.toLowerCase())
            );
        }
        const page = search.Page;
        const limit = await getLimit();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedClasses = pricesData.slice(startIndex, endIndex);

        response.Items = paginatedClasses.map((s: Price) => {
            return {
                id: s.id,
                status: s.status,
                name: s.name,
                regularPrice: s.regularPrice || 0,
                eftPrice: s.eftPrice || 0
            }
        })
        response.TotalItems = pricesData.length;
        response.PageSize = limit;
        return response;
    } catch (error) {
        console.error("Error obteniendo clases:", error);
        response.setError("Error interno del servidor");
        return response;
    }
}

export const changeStatusPriceRepository = async (priceId: string, type: string): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("config");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el nombre");
        }

        const prices: Price[] = docSnap.data()?.[type] ?? [];

        const price = prices.find((s: Price) => s.id === priceId);

        if (!price) {
            throw new Error("No se encontro el precio");
        }

        price.status = price.status === 'activo' ? 'inactivo' : 'activo';

        if (price.status === 'inactivo') {
            if (type === 'studensPrice') {
                const isPriceUsedByStudent = await checkIsPriceUsedByStudent(price.id)
                if (isPriceUsedByStudent) {
                    response.setError("El precio esta siendo utilizado por un alumno, no se puede desactivar.");
                    return response;
                }
            }
            if (type === 'teachersPrice') {
                const isPriceUsedByStudent = await checkIsPriceUsedByTeacher(price.id)
                if (isPriceUsedByStudent) {
                    response.setError("El precio esta siendo utilizado por una maestra, no se puede desactivar.");
                    return response;
                }
            }
        }

        await docRef.update({ [type]: prices });

        response.setSuccess("Estudiante actualizado correctamente");

    } catch (error: any) {
        response.setError(error.message);
    }

    return response;
}

