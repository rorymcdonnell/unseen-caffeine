import express from "express";
import {
  cancelUserSubscription,
  createUserSubscription,
  getSubscriptionProducts,
  getUserSubscriptions,
  getSubscriptionById,
  updateSubscription,
} from "../controllers/subscriptionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/products").get(protect, getSubscriptionProducts);
router.route("/products").post(protect, createUserSubscription);
router.route("/subscriptions").get(protect, getUserSubscriptions);
router.route("/:id/:subscriptionId").delete(protect, cancelUserSubscription);
router.route("/subscriptions/:id").get(protect, getSubscriptionById);
router.route("/subscriptions/:id").put(protect, updateSubscription);
export default router;
