import express from "express";
import {
  getFreezers,
  addFreezer,
  updateFreezer,
  deleteFreezer,
} from "../controllers/freezerController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", protect, getFreezers);
router.post("/", protect, addFreezer);
router.put("/:id", protect, updateFreezer);
router.delete("/:id", protect, deleteFreezer);

module.exports = router;
