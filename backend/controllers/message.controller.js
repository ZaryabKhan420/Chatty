import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../lib/ApiError.js";
import { ApiResponse } from "../lib/ApiResponse.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../index.js";
import { io } from "../lib/socket.js";

export const handleGetUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const users = await User.find({ _id: { $ne: currentUserId } }).select(
      "-password"
    );

    if (!users) {
      return res.status(401).json(new ApiError(401, "Error in fetching Users"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, users, "Users fetched Successfully"));
  } catch (error) {
    console.log("Error in fetching Users", error);
    return res.status(500).json(new ApiError(500, "Error in fetching Users.."));
  }
};

export const handleGetMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = String(req.user._id);

    const messages = await Message.find({
      $or: [
        {
          senderId: senderId,
          receiverId: userToChatId,
        },
        {
          senderId: userToChatId,
          receiverId: senderId,
        },
      ],
    });

    if (!messages) {
      return res
        .status(401)
        .json(new ApiError(401, "Error in fetching Messages"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, messages, "Messages fetched Successfully"));
  } catch (error) {
    console.log("Error in fetching Messages", error);
    return res
      .status(500)
      .json(new ApiError(500, "Error in fetching Messages.."));
  }
};

export const handleSendMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const { text, image } = req.body;
    const senderId = req.user._id;
    var imageUrl = "";

    if (image) {
      const uploadImageResult = await cloudinary.uploader.upload(image, {
        folder: "chatty",
      });

      if (!uploadImageResult) {
        return res
          .status(401)
          .json(new ApiError(401, "Error in uploading image on cloudinary"));
      }
      imageUrl = uploadImageResult.secure_url;
    }

    const newMessage = await Message.create({
      senderId: senderId,
      receiverId: userToChatId,
      text: text,
      image: imageUrl,
    });

    const sendMessage = await newMessage.save();

    if (!sendMessage) {
      return res
        .status(401)
        .json(new ApiError(401, "Error in Sending Message"));
    }

    // Realtime functionality
    const receiverSocketId = getReceiverSocketId(userToChatId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res
      .status(200)
      .json(new ApiResponse(200, newMessage, "Message Send Successfully"));
  } catch (error) {
    console.log("Error in Sending Message", error);
    return res
      .status(500)
      .json(new ApiError(500, "Error in Sending Message.."));
  }
};
