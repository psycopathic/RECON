import express from "express";
import {
	getNotifications,
	getUnreadCount,
	markAsRead,
	markAllAsRead,
} from "../controllers/notificationControllers.js";
import { protectedRoutes, adminRoute } from "../middleware.js/authMiddleware.js";

const router = express.Router();

router.get("/", protectedRoutes, adminRoute, getNotifications);
router.get("/unread-count", protectedRoutes, adminRoute, getUnreadCount);
router.put("/:id/read", protectedRoutes, adminRoute, markAsRead);
router.put("/read-all", protectedRoutes, adminRoute, markAllAsRead);

export default router;
