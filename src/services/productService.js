import { Product } from "../data/products.js";

export async function getProducts(category, supplier, sortBy, order) {
    const filter = {};

    if(category !== undefined) {
        filter.category = category;
    }

     if(supplier !== undefined) {
        filter.supplier = supplier;
    }

    let query = Product.find(filter);

    if(sortBy !== undefined && order !== undefined) {
        const sortOrder = order === "desc" ? -1 : 1;
        query = query.sort({ [sortBy]: sortOrder});
    }

    return await query.exec();
}

export async function getProductById(id) {
    return await Product.findById(id);
}

export async function createProduct(product) {
    return await Product.create(product);
}

export async function updateProductById(id, body) {
    return await Product.findByIdAndUpdate(id, body, { new: true});
}

export async function deleteProductById(id) {
    return await Product.findByIdAndDelete(id);
}

export async function updateProductStock(id, newStock) {
    return await Product.findByIdAndUpdate(
        id,
        { Stock: newStock},
        { new: true}
    );
}