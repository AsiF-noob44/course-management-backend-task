import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  logoutUser,
  updateUser,
  getUserProfile,
  deleteUser,
} from "../controllers/userController.js";
import { validateUser } from "../middlewares/validate.js";
const router = express.Router();

//? Register User
router.post("/register", registerUser);

//? Login User
router.post("/login", loginUser);

//? Get User Profile
router.get("/profile", validateUser, getUserProfile);

//? Update User Profile
router.put("/profile", validateUser, updateUser);

//? Delete User Account
router.delete("/profile", validateUser, deleteUser);

//? Get All Users
router.get("/", validateUser, getAllUsers);

//? Logout User
router.post("/logout", validateUser, logoutUser);

export default router;
