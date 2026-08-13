import express from "express";
import { getAvailableSystems } from "../controllers/systemController.js";

const router = express.Router();

router.get("/available", getAvailableSystems);

export default router;
