import { Request, Response } from "express";
import { ProductModel } from "../models/products.model.js";
import mongoose from "mongoose";
import { CategoryModel } from "../models/category.model.js";

// Crear un producto
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { categoria_id, vendedor_uid } = req.body;

    // 1️⃣ Validar que la categoría exista
    const categoria = await CategoryModel.findById(categoria_id);
    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    // 2️⃣ Validar que el vendedor_uid coincida con el usuario autenticado
    if (req.user?.uid !== vendedor_uid) {
      return res.status(403).json({ message: "No puedes crear productos en nombre de otro vendedor" });
    }

    // 3️⃣ Validar datos obligatorios
    if (!req.body.nombre || !req.body.precio || req.body.stock === undefined) {
      return res.status(400).json({ 
        message: "Faltan campos obligatorios: nombre, precio, stock" 
      });
    }

    // 4️⃣ Validar que precio sea positivo
    if (typeof req.body.precio !== 'number' || req.body.precio <= 0) {
      return res.status(400).json({ 
        message: "El precio debe ser un número positivo" 
      });
    }

    // 5️⃣ Validar que stock sea no negativo
    if (typeof req.body.stock !== 'number' || req.body.stock < 0) {
      return res.status(400).json({ 
        message: "El stock no puede ser negativo" 
      });
    }

    // 6️⃣ Crear el producto si todas las validaciones pasaron
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

    // ✅ Buscar el producto y hacer populate
    const product = await ProductModel.findById(id)
      .populate("categoria_id");

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
    const { id } = req.params;
    const { vendedor_uid } = req.body;

    // 1️⃣ Validar que sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de producto no válido" });
    }

    // 2️⃣ Obtener el producto actual
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // 3️⃣ Validar que solo el propietario pueda actualizar
    if (product.vendedor_uid !== req.user?.uid) {
      return res.status(403).json({ message: "No tienes permiso para actualizar este producto" });
    }

    // 4️⃣ Validar que no intente cambiar el vendedor
    if (vendedor_uid && vendedor_uid !== product.vendedor_uid) {
      return res.status(403).json({ message: "No puedes cambiar el propietario del producto" });
    }

    // 5️⃣ Validar datos si se proporcionan
    if (req.body.precio !== undefined) {
      if (typeof req.body.precio !== 'number' || req.body.precio <= 0) {
        return res.status(400).json({ message: "El precio debe ser un número positivo" });
      }
    }

    if (req.body.stock !== undefined) {
      if (typeof req.body.stock !== 'number' || req.body.stock < 0) {
        return res.status(400).json({ message: "El stock no puede ser negativo" });
      }
    }

    // 6️⃣ Actualizar
    const updated = await ProductModel.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);

  } catch (error) {
    console.error("Error actualizando producto:", error);
    res.status(500).json({ message: "Error al actualizar producto" });
  }
};

// Eliminar producto
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 1️⃣ Validar que sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de producto no válido" });
    }

    // 2️⃣ Obtener el producto
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // 3️⃣ Validar que solo el propietario o admin puedan eliminar
    if (product.vendedor_uid !== req.user?.uid && req.user?.role !== "admin") {
      return res.status(403).json({ message: "No tienes permiso para eliminar este producto" });
    }

    // 4️⃣ Eliminar
    await ProductModel.findByIdAndDelete(id);
    res.json({ message: "Producto eliminado correctamente" });

  } catch (error) {
    console.error("Error eliminando producto:", error);
    res.status(500).json({ message: "Error al eliminar producto" });
  }
};