import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded) {
        res.status(401).json({ message: "Unauthorized" });
      }
      const user = await User.findById(decoded.userId).select("-password");
      if (!user) {
        return res.status(403).json({ message: "User not found" });
      }
      req.user = user;
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
