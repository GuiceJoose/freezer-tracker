import express from "express";
import {
  getItems,
  addItem,
  updateItem,
  deleteItem,
} from "../controllers/itemController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", protect, getItems);
router.post("/", protect, addItem);
router.put("/:id", protect, updateItem);
router.delete("/:id", protect, deleteItem);

module.exports = router;
