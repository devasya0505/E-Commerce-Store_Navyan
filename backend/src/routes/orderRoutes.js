import express from "express";
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus
} from "../controllers/orderController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createOrder);
router.get("/mine", getMyOrders);
router.get("/admin/all", adminOnly, getAllOrders);
router.route("/:id").get(getOrderById).put(adminOnly, updateOrderStatus);

export default router;

