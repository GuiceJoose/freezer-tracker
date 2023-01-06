import { Response } from "express";
import asyncHandler from "express-async-handler";
import { Freezer } from "../entity/Freezer";
import { AppDataSource } from "../data-source";
import { IGetUserAuthInfoRequest } from "../middleware/authMiddleware";

// @desc Get user's freezers
// @route GET /api/freezers
// @access Private
export const getFreezers = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { id } = req.user!;
    const freezers = await AppDataSource.manager.find(Freezer, {
      where: { user_id: id },
    });
    res.status(200).json(freezers);
  }
);

// @desc Add Freezer
// @route POST /api/freezers/
// @access Private
export const addFreezer = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { id } = req.user!;
    const { freezerName } = req.body;

    if (!freezerName) {
      res.status(400);
      throw new Error("Please enter a name for this freezer");
    }
    // Check if freezer with same name and user exists
    const freezerExists = await AppDataSource.manager.findOne(Freezer, {
      where: {
        user_id: id,
        freezer_name: freezerName,
      },
    });
    if (freezerExists) {
      res.status(400);
      throw new Error("Freezer already exists");
    }

    // Create freezer
    const freezer = await Freezer.create({
      freezer_name: freezerName,
      user_id: id,
    });
    await AppDataSource.manager.insert(Freezer, freezer);

    if (freezer) {
      res.status(201).json({
        id: freezer.id,
        user_id: freezer.user_id,
        freezerName: freezer.freezer_name,
      });
    } else {
      res.status(400);
      throw new Error("Invalid freezer data");
    }
  }
);

// @desc    Update freezer
// @route   PUT /freezer/:id
// @access  Private
export const updateFreezer = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { id } = req.user!;
    const { freezerName } = req.body;
    const freezer = await AppDataSource.manager.findOneBy(Freezer, {
      id: parseInt(req.params.id),
    });

    if (!freezer) {
      res.status(400);
      throw new Error("Freezer not found");
    }

    // Check for user
    if (!req.user) {
      res.status(401);
      throw new Error("User not found");
    }

    // Make sure the logged in user matches the goal user
    if (freezer.user_id !== id) {
      res.status(401);
      throw new Error("User not authorized");
    }
    freezer.freezer_name = freezerName;
    await AppDataSource.manager.save(freezer);

    res.status(200).json(freezer);
  }
);

// @desc Delete a freezer
// @route Delete /api/freezers/:id
// @access Private
export const deleteFreezer = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { id } = req.user!;
    const freezer = await AppDataSource.manager.findOneBy(Freezer, {
      id: parseInt(req.params.id),
    });

    if (!freezer) {
      res.status(400);
      throw new Error("Freezer not found");
    }

    // Check for user
    if (!req.user) {
      res.status(401);
      throw new Error("User not found");
    }

    // Make sure the logged in user matches the goal user
    if (freezer.user_id !== id) {
      res.status(401);
      throw new Error("User not authorized");
    }

    await AppDataSource.manager.remove(freezer);

    res.status(200).json({ id: req.params.id });
  }
);
