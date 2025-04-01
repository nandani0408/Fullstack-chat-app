import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebars = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    // const current = req.query.page;
    // const limit = 5;
    // const skip = (current - 1) * limit;
    const totalUsers = await User.countDocuments({
      _id: { $ne: loggedInUserId },
    });

    // const totalPages = Math.ceil(totalUsers / limit);
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password"
    );
    // .skip(skip)
    // .limit(limit);
    return res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;
    // const page = parseInt(req.body.page) || 1;
    // const limit = parseInt(req.body.limit) || 2;
    // const skip = (page - 1) * limit;
    const totalMessages = await Message.countDocuments({
      $or: [
        { senderId: senderId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: senderId },
      ],
    });
    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: senderId },
      ],
    });
    // .skip(skip)
    // .limit(limit);
    // const totalPages = Math.ceil(totalUsers / limit);
    return res.status(200).json({ messages });
  } catch (error) {
    console.log("Error: " + error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { image, text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();
    const receiverSocketId = getReceiverSocketId(receiverId);

    io.to(receiverSocketId).emit("newMessage", newMessage);

    return res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error: " + error.message);

    return res.status(500).json({ message: "Internal server error" });
  }
};
