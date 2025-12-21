import express from "express";
import { getAvailableSystems, bookSystem } from "../controllers/systemController.js";
const router = express.Router();

router.get("/available", getAvailableSystems);
router.post("/book", bookSystem);

export default router;