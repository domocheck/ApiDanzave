

import { format } from "@formkit/tempo";
import { db } from "../../../Firebase/firebase";
import { generateAccountRepository } from "../../Accounts/Repository/Accounts.repository";
import { getCategoriesProductsFromConfigRepository, getColorsProductsFromConfigRepository, getLimit, getPaymentsMethodsFromConfigRepository, getSizesProductsFromConfigRepository } from "../../Config/Repository/Config.repository";
import { IMovement, MoveByPayments } from "../../Drawers/Models/Drawer.models";
import { getCompanyName } from "../../Others/Helpers/getCompanyName";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { getStudentsActives } from "../../Students/Repository/StudentsRepository";
import { IProduct, PagedListProducts, SearchPagedListProducts } from "../Models/Paged-list-products.models";
import { Product, ProductChooserTable, ProductsResponse } from "../Models/Products.models";
import { PagedListProductChooser, SearchPagedListProductChooser } from "../Models/Sale-product-paged-list.model";
import { Sale } from "../Models/Sale.models";
import { v4 as uuidv4 } from 'uuid';
import { saveMovementService } from "../../Drawers/Service/Drawer.service";


export const getPagedListProductsRepository = async (search: SearchPagedListProducts): Promise<PagedListProducts> => {
    const response = new PagedListProducts();
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        const docRef = db.collection(companyName).doc("zBoutique");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            response.setError("No se encontraron prodcutos");
            return response;
        }

        let productsData: Product[] = docSnap.data()?.products;

        if (!Array.isArray(productsData)) {
            response.setError("No se encontraron productos válidos.");
            return response;
        }
        if (search.Status && search.Status !== 'all') {
            productsData = productsData.filter((item: Product) => item.status === search.Status);
        }

        if (search.Name) {
            productsData = productsData.filter((item: Product) =>
                item.name.toLowerCase().includes(search.Name.toLowerCase())
            );
        };

        if (search.Category && search.Category !== 'all') {
            productsData = productsData.filter((item: Product) =>
                item.categoryId === search.Category
            );
        }

        const page = search.Page;
        const limit = await getLimit();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedProducts = productsData.slice(startIndex, endIndex);
        const categories = await getCategoriesProductsFromConfigRepository();
        const sizes = await getSizesProductsFromConfigRepository();
        const colors = await getColorsProductsFromConfigRepository();

        response.Items = paginatedProducts.map((p: Product) => {
            return {
                id: p.id,
                status: p.status,
                categoryName: categories.find(c => c.id === p.categoryId)?.name || "Sin categoria",
                price: p.regularPrice,
                variables: p.variables.map(v => {
                    return {
                        ...v,
                        sizeName: sizes.find(s => s.id === v.sizeId)?.name || "Sin talle",
                        colorName: colors.find(c => c.id === v.colorId)?.name || "Sin color",
                    }
                }),
                rentability: p.rentability || 0,
                code: p.code || "Sin codigo",
                name: p.name,
                totalStock: p.variables.reduce((acc, v) => acc + (v.stock ? v.stock : 0), 0),
            }
        })
        response.TotalItems = productsData.length;
        response.PageSize = limit;
        response.FilteringOptionsCategories = categories.map(c => ({ id: c.id!, name: c.name }));
        response.FilteringOptionsCategories.unshift({ id: 'all', name: 'Todos' });
        return response;
    } catch (error) {
        console.error("Error obteniendo clases:", error);
        response.setError("Error interno del servidor");
        return response;
    }
}

export const getProductsRepository = async (): Promise<ProductsResponse> => {
    const response = new ProductsResponse();
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        const docRef = db.collection(companyName).doc("zBoutique");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            response.setError("No se encontraron prodcutos");
            return response;
        }

        let productsData: Product[] = docSnap.data()?.products;

        if (!Array.isArray(productsData)) {
            response.setError("No se encontraron productos válidos.");
            return response;
        }
        response.Items = productsData
        return response;
    } catch (error) {
        console.error("Error obteniendo clases:", error);
        response.setError("Error interno del servidor");
        return response;
    }
}

export const getProductsByStatusRepository = async (status: string): Promise<ProductsResponse> => {
    const response = new ProductsResponse();
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        const docRef = db.collection(companyName).doc("zBoutique");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            response.setError("No se encontraron prodcutos");
            return response;
        }

        let productsData: Product[] = docSnap.data()?.products ?? [];

        if (!Array.isArray(productsData)) {
            response.setError("No se encontraron productos válidos.");
            return response;
        }
        response.Items = productsData.filter(p => p.status === status);
        return response;
    } catch (error) {
        console.error("Error obteniendo clases:", error);
        response.setError("Error interno del servidor");
        return response;
    }
}

export const getSalesRepository = async (): Promise<Sale[]> => {
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        const docRef = db.collection(companyName).doc("zBoutique");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontraron prodcutos");
        }

        return docSnap.data()?.sales ?? [];
    } catch (error) {
        console.error("Error obteniendo clases:", error);
        throw new Error("Error interno del servidor");
    }
}

export const getPagedListProductChooserRepository = async (search: SearchPagedListProductChooser): Promise<PagedListProductChooser> => {
    const response = new PagedListProductChooser();
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        const docRef = db.collection(companyName).doc("zBoutique");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            response.setError("No se encontraron prodcutos");
            return response;
        }

        let productsData: Product[] = docSnap.data()?.products.filter((p: Product) => p.status === 'activo');

        if (!Array.isArray(productsData)) {
            response.setError("No se encontraron productos válidos.");
            return response;
        }

        if (search.Name) {
            productsData = productsData.filter((item: Product) =>
                item.name.toLowerCase().includes(search.Name.toLowerCase())
            );
        };

        if (search.Category && search.Category !== 'all') {
            productsData = productsData.filter((item: Product) =>
                item.categoryId === search.Category
            );
        }

        const page = search.Page;
        const limit = await getLimit();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedProducts = productsData.slice(startIndex, endIndex);
        const categories = await getCategoriesProductsFromConfigRepository();
        const sizes = await getSizesProductsFromConfigRepository();
        const colors = await getColorsProductsFromConfigRepository();

        for (let product of paginatedProducts) {
            const categoryName = categories.find((cat) => cat.id === product.categoryId)!.name;
            for (let i = 0; i < product.variables.length; i++) {
                const sizeName = sizes.find((size) => size.id === product.variables[i].sizeId)!.name;
                const colorName = colors.find(
                    (color) => color.id === product.variables[i].colorId,
                )!.name;
                const stock = product.variables[i].stock || 0;

                const newProd: ProductChooserTable = {
                    id: product.id,
                    name: `${product.name} (${sizeName} - ${colorName})`,
                    stock,
                    regularPrice: product.regularPrice,
                    eftPrice: product.eftPrice,
                    categoryName,
                    quantity: 0,
                    variableId: product.variables[i].variableId,
                };
                response.Items.push(newProd);
            }
        }
        response.TotalItems = productsData.length;
        response.PageSize = limit;
        response.FilteringOptionsCategories = categories.map(c => ({ id: c.id!, name: c.name }));
        response.FilteringOptionsCategories.unshift({ id: 'all', name: 'Todos' });
        response.PaymentsMethods = await getPaymentsMethodsFromConfigRepository();
        response.StudentsActives = await getStudentsActives();
        return response;
    } catch (error) {
        console.error("Error obteniendo clases:", error);
        response.setError("Error interno del servidor");
        return response;
    }
}

export const changeStatusProductRepository = async (productId: string): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("zBoutique");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el nombre");
        }

        const products = docSnap.data()?.products ?? [];

        const product: Product = products.find((s: Product) => s.id === productId);

        if (!product) {
            throw new Error("No se encontro el producto");
        }

        product.status = product.status === 'activo' ? 'inactivo' : 'activo';
        await docRef.update({ products });

        response.setSuccess("Estudiante actualizado correctamente");

    } catch (error: any) {
        response.setError(error.message);
    }

    return response;
}

export const saveProductRepository = async (product: Product): Promise<ResponseMessages> => {
    const response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("zBoutique");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el nombre");
        }

        const products: Product[] = docSnap.data()?.products ?? [];
        const index = products.findIndex((s: Product) => s.id === product.id);

        if (index !== -1) {
            products.splice(index, 1, product);
        } else {
            products.unshift(product);
        }

        await docRef.update({ products });
        response.setSuccess("Product actualizado correctamente");

    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
    return response
}

export const saveProductsRepository = async (newProducts: Product[]): Promise<ResponseMessages> => {
    const response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("zBoutique");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el nombre");
        }

        let products: Product[] = docSnap.data()?.products ?? [];

        products = newProducts

        await docRef.update({ products });
        response.setSuccess("Product actualizado correctamente");

    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
    return response
}

export const saveStockRepository = async (product: IProduct): Promise<ResponseMessages> => {
    const response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("zBoutique");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el nombre");
        }

        const products: Product[] = docSnap.data()?.products ?? [];
        const currentProduct = products.find((s: Product) => s.id === product.id);

        if (currentProduct) {
            currentProduct.variables = product.variables;
            await docRef.update({ products });
            response.setSuccess("Product actualizado correctamente");
        }

    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
    return response
}

export const saveSaleRepository = async (sale: Sale): Promise<ResponseMessages> => {
    const response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("zBoutique");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el nombre");
        }

        const sales: Sale[] = docSnap.data()?.sales ?? [];

        if (sale.ctaCte) {
            await generateAccountRepository({
                personId: sale.personId,
                type: 'students',
                amount: sale.total,
                eftAmount: sale.total,
                description: 'Venta de boutique'
            })
        } else if (!sale.ctaCte && sale.paymentMethod && sale.paymentMethod.length > 0) {
            const newMovement: IMovement = {
                id: uuidv4(),
                amount: sale.total,
                paymentsMethods: sale.paymentMethod,
                description: 'Venta de boutique',
                date: format(new Date(), { date: 'full', time: 'short' }),
                idPerson: sale.personId,
                type: 'receipt',
                balance: sale.total,
            };
            await saveMovementService(newMovement);
        }
        sales.unshift(sale);
        await docRef.update({ sales });

    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
    return response
}

export const getProductByIdRepository = async (id: string): Promise<Product> => {
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("zBoutique");

        // Obtener el documento
        const docSnap = await docRef.get();

        // Verificar si el documento existe
        if (!docSnap.exists) {
            throw new Error("No se encontraron productos");
        }

        // Acceder al campo 'classes' dentro del documento
        let productsData: Product[] = docSnap.data()?.products;
        // Verificar si 'products' existe y es un arreglo
        if (!Array.isArray(productsData)) {
            throw new Error("No se encontraron productos válidas");
        }

        const classFound = productsData.find((item: Product) => item.id === id);
        if (!classFound) return {} as Product
        return classFound
    } catch (error: any) {
        console.error("Error obteniendo productos:", error);
        throw new Error("Error interno del servidor");
    }

}