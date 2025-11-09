import User from "../models/User.js";
import authConfigs from "../configs/auth.js";
import bcryptjs from "bcryptjs";

//? Register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          message: "Invalid email format",
        });
      }
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists",
      });
    }

    const newUser = new User({ name, email, password, phoneNumber });
    await newUser.save();

    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    res.status(201).json({
      message: "User registered successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Error registering user:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation error",
        errors: messages,
      });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        message: `User with this ${field} already exists`,
      });
    }

    res.status(500).json({
      message: "Server error while registering user",
      error: error.message,
    });
  }
};

//? Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = authConfigs.encodeToken(user.email, user._id.toString());

    res.cookie("user-token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({
      success: false,
      message: "Server error while logging in user",
      error: error.message,
    });
  }
};

//? Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user profile",
      error: error.message,
    });
  }
};

//? Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

//? Logout
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("user-token", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({
      success: false,
      message: "Error logging out",
      error: error.message,
    });
  }
};

//? Update User
export const updateUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, email, phoneNumber, currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }

      const existingUser = await User.findOne({
        email,
        _id: { $ne: userId },
      });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email already in use",
        });
      }
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password is required to set new password",
        });
      }

      const isMatch = await bcryptjs.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "New password must be at least 6 characters long",
        });
      }

      user.password = newPassword;
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    await user.save();

    const updatedUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  }
};
