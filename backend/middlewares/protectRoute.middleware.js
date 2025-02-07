import { ApiError } from "../lib/ApiError.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
export async function protectRoute(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(400)
        .json(new ApiError(400, "Token not Found - Unauthenticated User"));
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return res
        .status(400)
        .json(new ApiError(400, "Token is not valid - Unauthenticated User"));
    }

    const user = await User.findById(decode.userId).select("-password");

    if (!user) {
      return res.status(404).json(new ApiError(404, "No User found"));
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in validating Token", error);
    return res.status(500).json(new ApiError(500, "Error in validating Token"));
  }
}
