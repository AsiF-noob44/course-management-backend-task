import Course from "../models/Course.js";
import cloudinary from "../configs/cloudinary.js";

// Helper function to extract public_id from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  const parts = url.split("/");
  const filename = parts[parts.length - 1];
  const publicId = filename.split(".")[0];
  return `course-images/${publicId}`;
};

//? Create Course
export const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      duration,
      durationUnit,
      category,
      instructorName,
      courseImage,
    } = req.body;
    const userId = req.user.userId;

    let finalCourseImage = null;
    if (req.file) {
      finalCourseImage = req.file.path;
    } else if (courseImage) {
      finalCourseImage = courseImage;
    }

    const newCourse = new Course({
      title,
      description,
      price,
      duration,
      durationUnit,
      category,
      instructorName,
      courseImage: finalCourseImage,
      createdBy: userId,
    });

    await newCourse.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);

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
      message: "Server error while creating course",
      error: error.message,
    });
  }
};

//? Get All Courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching courses",
      error: error.message,
    });
  }
};

//? Get Single Course by ID
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id).populate(
      "createdBy",
      "name email"
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    console.error("Error fetching course:", error);

    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error fetching course",
      error: error.message,
    });
  }
};

//? Update Course by ID
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const {
      title,
      description,
      price,
      duration,
      durationUnit,
      category,
      instructorName,
    } = req.body;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this course",
      });
    }

    if (title) course.title = title;
    if (description) course.description = description;
    if (price !== undefined) course.price = price;
    if (duration !== undefined) course.duration = duration;
    if (durationUnit) course.durationUnit = durationUnit;
    if (category) course.category = category;
    if (instructorName) course.instructorName = instructorName;

    if (req.file) {
      if (course.courseImage) {
        const publicId = getPublicIdFromUrl(course.courseImage);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (error) {
            console.error("Error deleting old image:", error);
          }
        }
      }
      course.courseImage = req.file.path;
    } else if (req.body.courseImage !== undefined) {
      if (course.courseImage && course.courseImage !== req.body.courseImage) {
        const publicId = getPublicIdFromUrl(course.courseImage);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (error) {
            console.error("Error deleting old image:", error);
          }
        }
      }
      course.courseImage = req.body.courseImage;
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error("Error updating course:", error);

    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

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
      message: "Error updating course",
      error: error.message,
    });
  }
};

//? Delete Course by ID
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this course",
      });
    }

    if (course.courseImage) {
      const publicId = getPublicIdFromUrl(course.courseImage);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
          console.log("Image deleted from Cloudinary:", publicId);
        } catch (error) {
          console.error("Error deleting image from Cloudinary:", error);
        }
      }
    }

    await Course.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course:", error);

    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error deleting course",
      error: error.message,
    });
  }
};
