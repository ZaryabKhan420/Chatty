import { ApiResponse } from "../lib/ApiResponse.js";
import { ApiError } from "../lib/ApiError.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const handleSignUp = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res
      .status(400)
      .json(new ApiError(400, "All Fields must be required"));
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json(new ApiError(400, "Password must be atleast 6 characters"));
  }

  try {
    const isUserAlreadyExists = await User.findOne({ email });

    if (isUserAlreadyExists) {
      return res
        .status(401)
        .json(new ApiError(401, "User with this email already exists"));
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const createdUser = await newUser.save();

    if (!createdUser) {
      return res.status(401).json(new ApiError(401, "Error Saving User in DB"));
    }

    const token = generateToken(createdUser._id, res);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { ...createdUser._doc, password: undefined },
          "SignUp Successfully"
        )
      );
  } catch (error) {
    console.log("Error in SignUp", error);
    return res.status(500).json(new ApiError(500, "Error in SignUp"));
  }
};

export const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json(new ApiError(400, "All Fields must be required"));
  }

  try {
    const isUserExists = await User.findOne({ email });

    if (!isUserExists) {
      return res.status(400).json(new ApiError(400, "User not Found"));
    }

    const isPasswordCorrect = await bcryptjs.compare(
      password,
      isUserExists.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json(new ApiError(401, "Invalid Password"));
    }

    const token = generateToken(isUserExists._id, res);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { ...isUserExists._doc, password: undefined },
          "Login Successfully"
        )
      );
  } catch (error) {
    console.log("Error in Login", error);
    return res.status(500).json(new ApiError(500, "Error in Login"));
  }
};

export const handleLogout = async (req, res) => {
  try {
    const result = res.clearCookie("token");
    if (!result) {
      return res.status(401).json(new ApiError(401, "Error in clearing token"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Logout Successfully"));
  } catch (error) {
    console.log("Error in Logout", error);
    return res.status(500).json(new ApiError(500, "Error in Logout"));
  }
};

export const handleUpdateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res
        .status(400)
        .json(new ApiError(400, "Profile picture must be required"));
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      folder: "chatty",
    });

    if (!uploadResponse) {
      return res
        .status(401)
        .json(
          new ApiError(401, "Error in uploading profile picture on cloudinary")
        );
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { ...user._doc, password: undefined },
          "Profile Updated Successfully."
        )
      );
  } catch (error) {
    console.log("Error in updating User", error);
    return res.status(500).json(new ApiError(500, "Error in updating User"));
  }
};

export const handleCheck = async (req, res) => {
  try {
    return res.status(200).json(new ApiResponse(200, req.user, "User Found"));
  } catch (error) {
    console.log("Error in Handle Check Function");
    return res
      .status(500)
      .json(new ApiResponse(500, "Error in Handle Check Function"));
  }
};
