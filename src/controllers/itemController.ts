import { Response } from "express";
import asyncHandler from "express-async-handler";
import { Item } from "../entity/Item";
import { AppDataSource } from "../data-source";
import { IGetUserAuthInfoRequest } from "../middleware/authMiddleware";

// @desc Get all of user's items
// @route GET /api/items
// @access Private
export const getItems = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { id } = req.user!;
    const items = await AppDataSource.manager.find(Item, {
      where: { user_id: id },
    });
    res.status(200).json(items);
  }
);

// @desc Add Item
// @route POST /api/items/
// @access Private
export const addItem = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { id } = req.user!;
    const { freezerId, name, category, quantity, size, unit, date, notes } =
      req.body;

    if (
      !freezerId ||
      !name ||
      !category ||
      !quantity ||
      !size ||
      !unit ||
      !date
    ) {
      res.status(400);
      throw new Error("Please fill out all required fields");
    }

    // Create item
    const item = await Item.create({
      user_id: id,
      freezer_id: freezerId,
      name,
      category,
      quantity,
      size,
      unit,
      date,
      notes,
    });
    await AppDataSource.manager.insert(Item, item);

    if (item) {
      res.status(201).json({ item });
    } else {
      res.status(400);
      throw new Error("Invalid item data");
    }
  }
);

// @desc    Update item
// @route   PUT /item/:id
// @access  Private
export const updateItem = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { id } = req.user!;
    const { freezerId, name, category, quantity, size, unit, date, notes } =
      req.body;
    const item = await AppDataSource.manager.findOneBy(Item, {
      id: parseInt(req.params.id),
    });

    if (!item) {
      res.status(400);
      throw new Error("Item not found");
    }

    // Check for user
    if (!req.user) {
      res.status(401);
      throw new Error("User not found");
    }

    // Make sure the logged in user matches the goal user
    if (item.user_id !== id) {
      res.status(401);
      throw new Error("User not authorized");
    }

    item.freezer_id = freezerId;
    item.name = name;
    item.quantity = quantity;
    item.size = size;
    item.unit = unit;
    item.date = date;
    item.notes = notes;

    await AppDataSource.manager.save(item);

    res.status(200).json(item);
  }
);

// @desc Delete an item
// @route Delete /api/items/:id
// @access Private
export const deleteItem = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { id } = req.user!;
    const { freezerId } = req.body;
    const item = await AppDataSource.manager.findOneBy(Item, {
      id: parseInt(req.params.id),
    });

    if (!item) {
      res.status(400);
      throw new Error("Item not found");
    }

    // Check for freezer
    if (!freezerId) {
      res.status(401);
      throw new Error("Freezer not found");
    }

    // Check for user
    if (!req.user) {
      res.status(401);
      throw new Error("User not found");
    }

    // Make sure the logged in user matches the goal user
    if (item.user_id !== id) {
      res.status(401);
      throw new Error("User not authorized");
    }

    // Make sure the freezer deleted from matches the item freezer
    if (item.freezer_id !== freezerId) {
      res.status(401);
      throw new Error("Wrong freezer");
    }

    await AppDataSource.manager.remove(item);

    res.status(200).json({ id: req.params.id });
  }
);
