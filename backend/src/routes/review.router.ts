import express from "express";

import { getReviewsByProduct,createReview } from "../controllers/review.controller.js";

const router = express.Router();

router.get("/:productId", getReviewsByProduct);
router.post("/", createReview);

export default router;