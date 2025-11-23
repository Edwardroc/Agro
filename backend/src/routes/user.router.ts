import express from "express";
import {
  createUser,
  getAllUsers,
  getUserByFirebaseUID,
  updateUser,
  deleteUser,
  approveOrRejectUser,
} from "../controllers/user.controller.js";

import { verifyFirebaseToken } from "../middlewares/verifyFirebase.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = express.Router();

// Crear usuario (público pero requiere token)
router.post("/", verifyFirebaseToken, createUser);

// Obtener todos los usuarios (solo admin)
router.get("/", verifyFirebaseToken, checkRole(["admin"]), getAllUsers);

// Obtener usuario por UID de Firebase
router.get("/:uid", verifyFirebaseToken, getUserByFirebaseUID);

// Actualizar usuario por ID
router.put("/:id", verifyFirebaseToken, updateUser);

// Eliminar usuario (solo admin)
router.delete("/:id", verifyFirebaseToken, checkRole(["admin"]), deleteUser);

// Aprobar o rechazar usuario (solo admin)
router.patch("/:id/estado", verifyFirebaseToken, checkRole(["admin"]), approveOrRejectUser);

export default router;