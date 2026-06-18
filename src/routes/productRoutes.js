import { Router } from "express";

import {
  findProducts,
  findProductById,
  saveProduct,
  updateProduct,
  deleteProduct,
  checkoutProducts
} from "../controllers/productController.js";

const productRoutes = Router();

productRoutes.get("/", findProducts);

productRoutes.post("/", saveProduct);

productRoutes.put("/checkout", checkoutProducts);

productRoutes.get("/:id", findProductById);

productRoutes.patch("/:id", updateProduct);

productRoutes.delete("/:id", deleteProduct);

export default productRoutes;