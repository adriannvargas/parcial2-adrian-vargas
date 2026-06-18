import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    stock: Number,
    supplier: String
});

export const Product = mongoose.model("Product", productSchema);