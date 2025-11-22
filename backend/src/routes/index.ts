import { Router } from "express";
import cartRouter from "./cart.router";
import orderRouter from "./order.router";
import productRouter from "./product.router";
import reviewRouter from "./review.router";
import userRouter from "./user.router";
import notificationRouter from "./notification.router"

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
router.use("/notification",notificationRouter);

export default router;
