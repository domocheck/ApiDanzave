import { getCategoriesProductsFromConfigRepository, getCategoryByIdFromConfigRepository, getColorsProductsFromConfigRepository, getSizesProductsFromConfigRepository, saveReferenceRepository } from "../../Config/Repository/Config.repository";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { v4 as uuidv4 } from 'uuid';
import { IProduct, PagedListProducts, SearchPagedListProducts } from "../Models/Paged-list-products.models";
import { OptionsFormProduct, Product, ProductsResponse, Variables } from "../Models/Products.models";
import { changeStatusProductRepository, getPagedListProductChooserRepository, getPagedListProductsRepository, getProductByIdRepository, getProductsRepository, saveProductRepository, saveProductsRepository, saveSaleRepository, saveStockRepository } from "../Repository/Boutique.respository";
import { PagedListProductChooser, SearchPagedListProductChooser } from "../Models/Sale-product-paged-list.model";
import { Sale } from "../Models/Sale.models";

export const getProductByIdService = async (productId: string): Promise<ProductsResponse> => {
    let response = new ProductsResponse();
    const product = await getProductByIdRepository(productId);
    response.Items = [product];
    return response;
}
export const getPagedListProductsService = async (search: SearchPagedListProducts): Promise<PagedListProducts> => {
    let response = new PagedListProducts();
    try {
        response = await getPagedListProductsRepository(search);
    } catch (error: any) {
        response.setError(error.message);
        return response
    }

    return response;
}

export const getPagedListProductChooserService = async (search: SearchPagedListProductChooser): Promise<PagedListProductChooser> => {
    let response = new PagedListProductChooser();
    try {
        response = await getPagedListProductChooserRepository(search);
    } catch (error: any) {
        response.setError(error.message);
        return response
    }

    return response;
}

export const changeStatusProductsService = async (productId: string): Promise<ResponseMessages> => {
    return await changeStatusProductRepository(productId);
}

export const getOptionsFormProductService = async (): Promise<OptionsFormProduct> => {
    let response = new OptionsFormProduct();

    try {
        const [categories, sizes, colors] = await Promise.all([
            getCategoriesProductsFromConfigRepository(),
            getSizesProductsFromConfigRepository(),
            getColorsProductsFromConfigRepository()
        ])
        response.Categories = categories;
        response.Sizes = sizes;
        response.Colors = colors;
    } catch (error: any) {
        response.setError(error.message);
        return response;
    }

    return response;
}

export const saveProductService = async (product: Product): Promise<ResponseMessages> => {
    let response = new ResponseMessages();

    try {
        const hasNewCategory = (await getCategoryByIdFromConfigRepository(product.categoryId)).id !== product.categoryId;
        if (hasNewCategory) {
            const newCategoryId = uuidv4();
            await saveReferenceRepository(newCategoryId, product.categoryId, 'categoriesProducts');
            product.categoryId = newCategoryId;
        }
        const newSizes = product.variables.filter(variant => variant.type?.includes('Size'));
        const newColors = product.variables.filter(variant => variant.type?.includes('Color'));
        if (newSizes.length > 0) {
            for (let variable of newSizes) {
                const newSizeId = uuidv4();
                await saveReferenceRepository(newSizeId, variable.sizeId!, 'sizesProducts');
                variable.sizeId = newSizeId;
            }
        }
        if (newColors.length > 0) {
            for (let variable of newColors) {
                const newColorId = uuidv4();
                await saveReferenceRepository(newColorId, variable.colorId!, 'colorsProducts');
                variable.colorId = newColorId;
            }
        }
        response = await saveProductRepository(product);
        return response;
    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
}

export const saveStockService = async (product: IProduct): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        response = await saveStockRepository(product);
        return response;
    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
}

export const saveSaleService = async (sale: Sale): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        response = await saveSaleRepository(sale);
        if (response.hasErrors()) {
            return response;
        }
        const productsCopy = (await getProductsRepository()).Items
        for (let item of sale.items) {
            const prod = productsCopy.find((p) => p.id === item.id)!;
            if (prod) {
                const variable = prod.variables.find((v: Variables) => v.variableId === item.variableId)!;
                if (variable && variable.stock !== undefined) {
                    variable.stock -= item.quantity;
                }
            }
        }
        response = await saveProductsRepository(productsCopy);
        return response;
    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
}