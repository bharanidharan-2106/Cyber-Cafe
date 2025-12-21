import express from "express";
import { bookSystem } from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, bookSystem);

export default router;
