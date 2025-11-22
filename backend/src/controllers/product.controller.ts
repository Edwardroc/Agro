import { Request, Response } from "express";
import { ProductModel } from "../models/products.model";
import mongoose from "mongoose";
import { CategoryModel } from "../models/category.model";

// Crear un producto
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { categoria_id } = req.body;

    // 1️⃣ Validar que la categoría exista antes de crear el producto
    const categoria = await CategoryModel.findById(categoria_id);
    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    // 2️⃣ Crear el producto si la categoría es válida
    const product = await ProductModel.create(req.body);
    res.status(201).json(product);

  } catch (error) {
    console.error("Error creando producto:", error);
    res.status(500).json({ message: "Error al crear producto" });
  }
};


// Obtener todos los productos
export const getProducts = async (_: Request, res: Response) => {
  try {
    const products = await ProductModel.find().populate("categoria_id");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

// Obtener producto por ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // ✅ Validar que sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de producto no válido" });
    }

    // ✅ Buscar el producto y hacer populate correctamente
    const product = await ProductModel.findById(id)
      .populate("categoria_id")
     

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    console.error("❌ Error al obtener producto:", error);
    res.status(500).json({ message: "Error al obtener producto" });
  }
};
// Actualizar producto
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const updated = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch {
    res.status(500).json({ message: "Error al actualizar producto" });
  }
};

// Eliminar producto
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await ProductModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Producto eliminado" });
  } catch {
    res.status(500).json({ message: "Error al eliminar producto" });
  }
};
