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

// Base: /user
router.post("/", verifyFirebaseToken, createUser);
router.get("/", verifyFirebaseToken, checkRole(["admin"]), getAllUsers);
router.get("/:uid", verifyFirebaseToken, getUserByFirebaseUID);
router.put("/:id", verifyFirebaseToken, updateUser);
router.delete("/:id", verifyFirebaseToken, checkRole(["admin"]), deleteUser);
router.patch("/:id/estado", verifyFirebaseToken, checkRole(["admin"]), approveOrRejectUser);

export default router;