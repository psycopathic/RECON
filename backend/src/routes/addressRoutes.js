import express from "express";
import {
	getAddresses,
	addAddress,
	updateAddress,
	deleteAddress,
	setDefaultAddress,
} from "../controllers/addressControllers.js";
import { protectedRoutes } from "../middleware.js/authMiddleware.js";

const router = express.Router();

router.get("/", protectedRoutes, getAddresses);
router.post("/", protectedRoutes, addAddress);
router.put("/:id", protectedRoutes, updateAddress);
router.delete("/:id", protectedRoutes, deleteAddress);
router.put("/:id/default", protectedRoutes, setDefaultAddress);

export default router;
