import express from "express";
import {
  createUser,
  getAllUsers,
  getUserByFirebaseUID,
  updateUser,
  deleteUser,
  approveOrRejectUser,
} from "../controllers/user.controller";

import { verifyFirebaseToken } from "../middlewares/verifyFirebase";
import { checkRole } from "../middlewares/checkRole";

const router = express.Router();


router.post("/", verifyFirebaseToken, createUser);

// Obtener todos los usuarios (solo admin)
router.get("/", verifyFirebaseToken, checkRole(["admin"]), getAllUsers);

// Obtener usuario por UID de Firebase
router.get("/:uid", verifyFirebaseToken, getUserByFirebaseUID);

// Actualizar usuario por ID (cualquier usuario autenticado puede actualizar su info)
router.put("/:id", verifyFirebaseToken, updateUser);

// Eliminar usuario (solo admin)
router.delete("/:id", verifyFirebaseToken, checkRole(["admin"]), deleteUser);

// Aprobar o rechazar usuario (solo admin)
router.patch("/:id/estado", verifyFirebaseToken, checkRole(["admin"]), approveOrRejectUser);

export default router;
