import { Router } from "express";
import cartRouter from "./cart.router.js";
import orderRouter from "./order.router.js";
import productRouter from "./product.router.js";
import reviewRouter from "./review.router.js";
import userRouter from "./user.router.js";

const router = Router();

router.get("/", (_, res) => {
  res.send("API is running...");
});

// Agrupar rutas bajo prefijos
router.use("/cart", cartRouter);
router.use("/order", orderRouter);
router.use("/product", productRouter);
router.use("/review", reviewRouter);
router.use("/user", userRouter);

export default router;