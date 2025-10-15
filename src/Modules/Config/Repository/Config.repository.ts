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
import { getConfigModel } from "../../../mongo/schemas/config.schema";


export const getConfigRepository = async (): Promise<Config> => {
    let response = new Config();
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }

        // Obtenemos el modelo dinámico para esa compañía
        const ConfigModel = getConfigModel(companyName);

        // Buscamos el único documento de config
        const configDoc = await ConfigModel.findOne({}).lean();

        if (!configDoc) {
            return response;
        }

        response.Items = configDoc;
        return response;

    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
};


export const getHoursFromConfigRepository = async (): Promise<ScheduleHours[]> => {
    let response = [] as ScheduleHours[];
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }

        let configHours = (await getConfigRepository()).Items.hours;

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

        let expirationDays = (await getConfigRepository()).Items.expirationDays ?? 30;

        if (!expirationDays) {
            return response;
        }
        return expirationDays as NameAndId[];

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

        let configRanges = (await getConfigRepository()).Items.ranges;


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

        let configReasons = (await getConfigRepository()).Items.reasons;


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

        let configRoles = (await getConfigRepository()).Items.roles;


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

        let configReferences = (await getConfigRepository()).Items.references;


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

        let configContactMedia = (await getConfigRepository()).Items.contactMedia;


        if (!configContactMedia) {
            return response;
        }
        response = configContactMedia

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

        let configPaymentMethods = (await getConfigRepository()).Items.paymentsMethods;

        if (!configPaymentMethods) {
            return response;
        }
        response = configPaymentMethods

        return response;
    } catch (error) {
        console.error("Error obteniendo rangos:", error);
        return response;
    }
}

export const getMontlyByTeacherId = async (teacherId: string): Promise<number> => {

    const teacherMontly = (await getTeacherById(teacherId))?.monthly;

    let response = 0;
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }

        let configTeachersPrice = (await getConfigRepository()).Items.teachersPrice;


        if (!configTeachersPrice) {
            return response;
        }

        if (!configTeachersPrice) {
            return response;
        }
        response = configTeachersPrice.find(tp => tp.id === teacherMontly)?.regularPrice || 0

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

        let configCategories = (await getConfigRepository()).Items.categoriesProducts;


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

        let configSizes = (await getConfigRepository()).Items.sizesProducts;


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

        let configColorsProducts = (await getConfigRepository()).Items.colorsProducts;


        if (!configColorsProducts) {
            return response;
        }
        response = configColorsProducts

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

        const ConfigModel = getConfigModel(companyName);

        // Como solo hay un documento, buscamos por _id "config" y solo traemos el array reasons
        const configDoc = await ConfigModel.findById("config", { categoriesProducts: 1 }).lean();

        if (!configDoc || !Array.isArray(configDoc.categoriesProducts)) {
            return response;
        }

        // Buscamos la reason dentro del array
        return configDoc.categoriesProducts.find(r => r.id === categoryId)!;

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

        const ConfigModel = getConfigModel(companyName);

        // Como solo hay un documento, buscamos por _id "config" y solo traemos el array reasons
        const configDoc = await ConfigModel.findById("config", { reasons: 1 }).lean();

        if (!configDoc || !Array.isArray(configDoc.reasons)) {
            return response;
        }

        // Buscamos la reason dentro del array
        return configDoc.reasons.find(r => r.id === reasonId)!;
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

        let quantityPages = (await getConfigRepository()).Items.quantityPagesToSee;


        if (!quantityPages) {
            return response;
        }
        response = quantityPages

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
        const ConfigModel = getConfigModel(companyName);

        // Como solo hay un documento, buscamos por _id "config" y solo traemos el array reasons
        const configDoc = await ConfigModel.findById("config", { studentsPrice: 1 }).lean();

        if (!configDoc || !Array.isArray(configDoc.studentsPrice)) {
            return response;
        }

        let studentsPrice: Price[] = configDoc.studentsPrice.map((price: Price) => {
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
        const ConfigModel = getConfigModel(companyName);

        // Como solo hay un documento, buscamos por _id "config" y solo traemos el array reasons
        const configDoc = await ConfigModel.findById("config", { studentsPrice: 1 }).lean();

        if (!configDoc || !Array.isArray(configDoc.studentsPrice)) {
            return response;
        }

        let studentsPrice: Price[] = configDoc.studentsPrice.filter((p: Price) => p.status === status).map((price: Price) => {
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

        const ConfigModel = getConfigModel(companyName);

        // Como solo hay un documento, buscamos por _id "config" y solo traemos el array reasons
        const configDoc = await ConfigModel.findById("config", { teachersPrice: 1 }).lean();

        if (!configDoc || !Array.isArray(configDoc.teachersPrice)) {
            return response;
        }
        let teachersPrice: Price[] = configDoc.teachersPrice.map((price: Price) => {
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
        const ConfigModel = getConfigModel(companyName);

        // Como solo hay un documento, buscamos por _id "config" y solo traemos el array reasons
        const configDoc = await ConfigModel.findById("config", { teachersPrice: 1 }).lean();

        if (!configDoc || !Array.isArray(configDoc.teachersPrice)) {
            return response;
        }

        let teachersPrice: Price[] = configDoc.teachersPrice.filter((p: Price) => p.status === status).map((price: Price) => {
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

        const ConfigModel = getConfigModel(companyName);

        // Obtenemos solo el array references del documento de configuración
        const configDoc = await ConfigModel.findById("config", { references: 1 });

        if (!configDoc) {
            return response;
        }

        // Aseguramos que exista el array
        if (!Array.isArray(configDoc.references)) {
            configDoc.references = [];
        }

        // Buscamos si ya existe la referencia
        const currentReference = configDoc.references.find(r => r.name === referenceName);

        if (!currentReference) {
            // Creamos una nueva referencia
            const newReference: Reference = {
                id: uuidv4(),
                name: referenceName
            };

            // Agregamos al array y guardamos
            configDoc.references.push(newReference);
            await configDoc.save();

            response = newReference;
        } else {
            response = currentReference;
        }

        return response;

    } catch (error: any) {
        throw new Error(error.message);
    }
};


export const checkAndSaveContactMedia = async (contactMediaName: string): Promise<Reference> => {
    let response = {} as Reference;
    try {
        const companyName = getCompanyName();
        if (!companyName) {
            throw new Error("Company name is not set");
        }

        const ConfigModel = getConfigModel(companyName);

        // Obtenemos solo el array references del documento de configuración
        const configDoc = await ConfigModel.findById("config", { contactMedia: 1 });

        if (!configDoc) {
            return response;
        }

        // Aseguramos que exista el array
        if (!Array.isArray(configDoc.contactMedia)) {
            configDoc.contactMedia = [];
        }

        // Buscamos si ya existe la referencia
        const currentReference = configDoc.contactMedia.find(r => r.name === contactMediaName);

        if (!currentReference) {
            // Creamos una nueva referencia
            const newReference: Reference = {
                id: uuidv4(),
                name: contactMediaName
            };

            // Agregamos al array y guardamos
            configDoc.contactMedia.push(newReference);
            await configDoc.save();

            response = newReference;
        } else {
            response = currentReference;
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

        // Buscar el documento de configuración de la empresa
        const configDoc = await getConfigModel(companyName).findOne();
        if (!configDoc) throw new Error("No se encontró la configuración");

        // Accedemos al arreglo correspondiente (ej: configDoc.brands o configDoc.categories)
        const data = (configDoc as any)[type];
        if (!Array.isArray(data)) {
            response.setError("No se encontró el tipo especificado en la configuración");
            return response;
        }

        // Buscar si ya existe el elemento
        const index = data.findIndex((ref) => ref.id === id);

        if (index !== -1) {
            // Si existe, actualizar el nombre
            data[index].name = value;
        } else {
            // Si no existe, agregar uno nuevo al principio
            data.unshift({ id: uuidv4(), name: value });
        }

        // Guardar los cambios en la base de datos
        await configDoc.save();

        response.setSuccess("Configuración actualizada correctamente");
    } catch (error: any) {
        response.setError(error.message);
    }

    return response;
}

export const saveItemsToSeeRepository = async (quantity: number): Promise<ResponseMessages> => {
    const response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const ConfigModel = getConfigModel(companyName);

        // Actualiza solo el campo 'quantityPagesToSee'
        const updatedDoc = await ConfigModel.findByIdAndUpdate(
            "config", // si usás companyName como identificador: { companyName }
            { quantityPagesToSee: quantity },
            { new: true } // devuelve el documento actualizado
        );

        if (!updatedDoc) {
            response.setError("No se encontró el documento de configuración");
            return response;
        }

        response.setSuccess("Configuración actualizada correctamente");
    } catch (error: any) {
        response.setError(error.message);
    }

    return response;
}

export const savePaymentMethodRepository = async (paymentName: string, paymentId: string): Promise<ResponseMessages> => {
    const response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const ConfigModel = getConfigModel(companyName);

        // Buscar el documento de configuración
        const configDoc = await ConfigModel.findById("config"); // o findOne({ companyName }) si tu modelo lo usa

        if (!configDoc) {
            response.setError("No se encontró el documento de configuración");
            return response;
        }

        // Obtener el array de métodos de pago
        let paymentMethods: IPayments[] = configDoc.paymentsMethods || [];

        // Buscar si ya existe el paymentId
        if (paymentId) {
            const index = paymentMethods.findIndex((p) => p.id === paymentId);
            if (index !== -1) {
                paymentMethods[index].name = paymentName; // actualizar
            } else {
                paymentMethods.unshift({ id: paymentId, name: paymentName }); // agregar
            }
        } else {
            // Si no hay paymentId, crear uno nuevo
            paymentMethods.unshift({ id: uuidv4(), name: paymentName });
        }

        // Guardar cambios
        configDoc.paymentsMethods = paymentMethods;
        await configDoc.save();

        response.setSuccess("Configuración actualizada correctamente");
    } catch (error: any) {
        response.setError(error.message);
    }

    return response;
};

export const saveRangeHoursRepository = async (index: number, initialHour: number, finalHour: number): Promise<ResponseMessages> => {
    const response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const ConfigModel = getConfigModel(companyName);

        // Buscar documento de configuración
        const configDoc = await ConfigModel.findById("config"); // o findOne({ companyName })

        if (!configDoc) {
            response.setError("No se encontró el documento de configuración");
            return response;
        }

        // Obtener el array de horas
        const hours: ScheduleHours[] = configDoc.hours || [];

        // Validar que el índice exista
        if (index < 0 || index >= hours.length) {
            response.setError("Índice fuera de rango");
            return response;
        }

        // Actualizar las horas
        hours[index].initialHour = initialHour;
        hours[index].finalHour = finalHour;

        // Guardar cambios
        configDoc.hours = hours;
        await configDoc.save();

        response.setSuccess("Configuración actualizada correctamente");
    } catch (error: any) {
        response.setError(error.message);
    }

    return response;
};

export const saveRangeStudentsRepository = async (value: number, range: keyof Ranges): Promise<ResponseMessages> => {
    const response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const ConfigModel = getConfigModel(companyName);

        // Buscar documento de configuración
        const configDoc = await ConfigModel.findById("config"); // o findOne({ companyName })

        if (!configDoc) {
            response.setError("No se encontró el documento de configuración");
            return response;
        }

        // Obtener el array de horas
        const ranges: Ranges = configDoc.ranges || {} as Ranges;


        if (!ranges) {
            response.setError("No se encontro el item");
            return response;
        }

        ranges[range] = value;

        await configDoc.save();
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

        const ConfigModel = getConfigModel(companyName);

        // Buscar documento de configuración
        const configDoc = await ConfigModel.findById("config");

        if (!configDoc) {
            response.setError("No se encontró el documento de configuración");
            return response;
        }

        // Obtener el array de horas
        const pricesData: Price[] = (configDoc as any)[type] || [];

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

        await configDoc.save();
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

        const ConfigModel = getConfigModel(companyName);

        // Buscar documento de configuración
        const configDoc = await ConfigModel.findById("config");

        if (!configDoc) {
            response.setError("No se encontró el documento de configuración");
            return response;
        }

        // Obtener el array de horas
        let pricesData: Price[] = (configDoc as any)[search.Type] || [];

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

        const ConfigModel = getConfigModel(companyName);

        // Buscar documento de configuración
        const configDoc = await ConfigModel.findById("config");

        if (!configDoc) {
            response.setError("No se encontró el documento de configuración");
            return response;
        }

        // Obtener el array de horas
        let prices: Price[] = (configDoc as any)[type] || [];

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

        await configDoc.save();

        response.setSuccess("Estudiante actualizado correctamente");

    } catch (error: any) {
        response.setError(error.message);
    }

    return response;
}

