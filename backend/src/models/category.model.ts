import { Schema, model, Model } from "mongoose";
import { Category } from "../interfaces/category.interface";

const CategorySchema = new Schema<Category>(
  {
    nombre: { type: String, required: true, unique: true },
    descripcion: { type: String },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const CategoryModel = model<Category>("Category", CategorySchema) as Model<Category>;
