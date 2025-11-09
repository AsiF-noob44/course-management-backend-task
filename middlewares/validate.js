import authConfigs from "../configs/auth.js";

export const validateUser = (req, res, next) => {
  const token =
    req.cookies["user-token"] ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access - Please login First!",
    });
  }

  const decoded = authConfigs.decodeToken(token);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token - Please login Again!",
    });
  }

  req.user = {
    email: decoded.email,
    userId: decoded.id,
  };

  next();
};
