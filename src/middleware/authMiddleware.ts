import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";

export interface IGetUserAuthInfoRequest extends Request {
  user?: User | null;
}

export const protect = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response, next) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        // Get token from header
        token = req.headers.authorization.split(" ")[1];
        // Verify token
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET as string
        ) as JwtPayload;
        // Get user from token
        req.user = await AppDataSource.manager.findOne(User, {
          where: { id: decoded.id },
          select: { id: true, email: true, username: true },
        });

        next();
      } catch (error) {
        console.log(error);
        res.status(401);
        throw new Error("Not authorized");
      }
    }
    if (!token) {
      res.status(401);
      throw new Error("Not Authorized, no token");
    }
  }
);
