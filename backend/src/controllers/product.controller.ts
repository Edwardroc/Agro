import { Request, Response } from "express";
import { ProductModel } from "../models/products.model";
import { Error as MongooseError } from "mongoose"; // Importamos el tipo Error de Mongoose

// Crear un producto
export const createProduct = async (req: Request, res: Response) => {
  try {
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
    const products = await ProductModel.find().populate("categoria_id vendedor_id");
    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

// Obtener producto por ID (CORREGIDO)
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.findById(req.params.id).populate("categoria_id vendedor_id");

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    // Manejo de CastError para ID inválido
    if (error instanceof MongooseError.CastError) {
      return res.status(404).json({ message: "Formato de ID inválido o producto no encontrado" });
    }

    console.error("Error al obtener producto por ID:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Actualizar producto (CORREGIDO el manejo de errores)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const updated = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Producto no encontrado para actualizar" });
    }

    res.json(updated);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return res.status(404).json({ message: "Formato de ID inválido o producto no encontrado" });
    }

    console.error("Error al actualizar producto:", error);
    res.status(500).json({ message: "Error al actualizar producto" });
  }
};

// Eliminar producto (CORREGIDO el manejo de errores)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const deleted = await ProductModel.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Producto no encontrado para eliminar" });
    }

    res.json({ message: "Producto eliminado" });
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return res.status(404).json({ message: "Formato de ID inválido o producto no encontrado" });
    }

    console.error("Error al eliminar producto:", error);
    res.status(500).json({ message: "Error al eliminar producto" });
  }
};