import {
  getProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
  updateProductStock
} from "../services/productService.js";

import {
  validateProductBody,
  validateCheckoutBody
} from "../utils/productValidator.js";

export async function findProducts(req, res, next) {
  try {
    const { category, supplier, sortBy, order } = req.query;

    if (sortBy !== undefined) {
      if (sortBy !== "price" && sortBy !== "stock") {
        const error = Error("sortBy must be price or stock");
        error.statusCode = 400;
        return next(error);
      }

      if (order !== "asc" && order !== "desc") {
        const error = Error("order must be asc or desc");
        error.statusCode = 400;
        return next(error);
      }
    }

    if (order !== undefined && sortBy === undefined) {
      const error = Error("sortBy is required when order is present");
      error.statusCode = 400;
      return next(error);
    }

    const products = await getProducts(category, supplier, sortBy, order);

    return res.success(
      200,
      "Products retrieved successfully",
      products
    );
  } catch (error) {
    return next(error);
  }
}

export async function findProductById(req, res, next) {
  try {
    const product = await getProductById(req.params.id);

    if (!product) {
      const error = Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }

    return res.success(
      200,
      "Product retrieved successfully",
      product
    );
  } catch (error) {
    error.statusCode = 404;
    return next(error);
  }
}

export async function saveProduct(req, res, next) {
  try {
    const validator = validateProductBody(req.body, true);

    if (!validator.validation) {
      const error = Error(validator.message);
      error.statusCode = 400;
      return next(error);
    }

    const createdProduct = await createProduct(req.body);

    return res.success(
      200,
      "Product created successfully",
      createdProduct
    );
  } catch (error) {
    return next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const validator = validateProductBody(req.body, false);

    if (!validator.validation) {
      const error = Error(validator.message);
      error.statusCode = 400;
      return next(error);
    }

    const updatedProduct = await updateProductById(req.params.id, req.body);

    if (!updatedProduct) {
      const error = Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }

    return res.success(
      200,
      "Product updated successfully",
      updatedProduct
    );
  } catch (error) {
    error.statusCode = 404;
    return next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const deletedProduct = await deleteProductById(req.params.id);

    if (!deletedProduct) {
      const error = Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }

    return res.success(
      200,
      "Product deleted successfully",
      deletedProduct
    );
  } catch (error) {
    error.statusCode = 404;
    return next(error);
  }
}

export async function checkoutProducts(req, res, next) {
  try {
    const validator = validateCheckoutBody(req.body);

    if (!validator.validation) {
      const error = Error(validator.message);
      error.statusCode = 400;
      return next(error);
    }

    let totalPrice = 0;
    const productsToUpdate = [];

    for (const item of req.body.products) {
      const product = await getProductById(item.id);

      if (!product) {
        const error = Error(`Product with id ${item.id} not found`);
        error.statusCode = 400;
        return next(error);
      }

      if (item.quantity > product.stock) {
        const error = Error(`Quantity requested for ${product.name} is greater than stock`);
        error.statusCode = 400;
        return next(error);
      }

      totalPrice += product.price * item.quantity;

      productsToUpdate.push({
        id: item.id,
        newStock: product.stock - item.quantity
      });
    }

    for (const product of productsToUpdate) {
      await updateProductStock(product.id, product.newStock);
    }

    return res.success(
      200,
      "Checkout completed successfully",
      {
        totalPrice
      }
    );
  } catch (error) {
    return next(error);
  }
}