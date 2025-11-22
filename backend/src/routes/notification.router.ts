import express from "express";
import {
  createNotification,
  getNotificationsByUser,
  markNotificationAsRead,
  deleteNotification,
  clearNotificationsByUser,
} from "../controllers/notification.controller";

import { verifyFirebaseToken } from "../middlewares/verifyFirebase";
import { checkRole } from "../middlewares/checkRole";

const router = express.Router();


router.post("/", verifyFirebaseToken, checkRole(["admin"]), createNotification);
router.get("/:uid", verifyFirebaseToken, getNotificationsByUser);
router.patch("/:id/read", verifyFirebaseToken, markNotificationAsRead);
router.delete("/:id", verifyFirebaseToken, deleteNotification);
router.delete("/clear/:uid", verifyFirebaseToken, clearNotificationsByUser);

export default router;
