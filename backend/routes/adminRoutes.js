import express from "express";
import { addSystem, viewAvailableSystems, viewLoggedInUsers } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add-system", protect, addSystem);
router.get("/view-systems", protect, viewAvailableSystems);
router.get("/view-users", protect, viewLoggedInUsers);

export default router;