import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";
import { validateUser } from "../middlewares/validate.js";
import upload from "../configs/multer.js";

const router = express.Router();

//? Create Course
router.post("/", validateUser, upload.single("courseImage"), createCourse);

//? Get All Courses
router.get("/", validateUser, getAllCourses);

//? Get Single Course by ID
router.get("/:id", validateUser, getCourseById);

//? Update Course by ID
router.put("/:id", validateUser, upload.single("courseImage"), updateCourse);

//? Delete Course by ID
router.delete("/:id", validateUser, deleteCourse);

export default router;
