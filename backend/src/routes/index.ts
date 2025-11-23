import { Router } from "express";
import cartRouter from "./cart.router.js";
import orderRouter from "./order.router.js";
import productRouter from "./product.router.js";
import reviewRouter from "./review.router.js";
import userRouter from "./user.router.js";
import notificationRouter from "./notification.router.js";

const router = Router();

router.get("/", (_, res) => {
  res.send("API is running...");
});

// Rutas con prefijos claros
router.use("/api/cart", cartRouter);
router.use("/api/order", orderRouter);
router.use("/api/product", productRouter);
router.use("/api/review", reviewRouter);
router.use("/api/user", userRouter);
router.use("/api/notification", notificationRouter);

export default router;