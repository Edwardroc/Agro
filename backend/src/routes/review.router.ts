import express from "express";
import {
  createReview,
  getReviewsByProduct,
  getAllReviews,
  updateReview,
  deleteReview
} from "../controllers/review.controller";
import { verifyFirebaseToken } from "../middlewares/verifyFirebase";
import { checkRole } from "../middlewares/checkRole";

const router = express.Router();


router.post("/", verifyFirebaseToken, checkRole(["comprador"]), createReview);
router.get("/:productId", getReviewsByProduct);
router.get("/", verifyFirebaseToken, checkRole(["admin"]), getAllReviews);
router.put("/:id", verifyFirebaseToken, checkRole(["comprador", "admin"]), updateReview);
router.delete("/:id", verifyFirebaseToken, checkRole(["comprador", "admin"]), deleteReview);
export default router;

