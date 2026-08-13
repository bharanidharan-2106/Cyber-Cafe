import express from "express";
import { addSystem, viewAvailableSystems, viewLoggedInUsers } from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add-system", protect, admin, addSystem);
router.get("/view-systems", protect, admin, viewAvailableSystems);
router.get("/view-users", protect, admin, viewLoggedInUsers);

export default router;