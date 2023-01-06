import { Request, Response } from "express";
import { IGetUserAuthInfoRequest } from "../middleware/authMiddleware";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";

// @desc Register user
// @route POST /api/users/
// @access Public
export const registerUser = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400);
      throw new Error("Please fill in all fields");
    }
    // Check if user exists
    const userExists = await AppDataSource.manager.findOneBy(User, {
      email: email,
    });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    await AppDataSource.manager.insert(User, user);

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.username,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  }
);

// @desc Authenticate a user
// @route POST /api/users/login
// @access Public
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // check for user email
  const user = await AppDataSource.manager.findOneBy(User, {
    email: email,
  });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// @desc Get user data
// @route GET /api/users/me
// @access Private
export const getMe = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    res.status(200).json(req.user);
  }
);

const generateToken = (id: number) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};
