import ApiError from "../Utils/ApiError.utils.js";

const errorHandlerMiddleware = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Mongoose ObjectId error
  if (err.name === "CastError") {
    error = new ApiError(404, "Resource not found");
  }

  // Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message =
      field.charAt(0).toUpperCase() + field.slice(1) + " already exists";
    error = new ApiError(400, message);
  }

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = new ApiError(400, message);
  }

  // JWT invalid
  if (err.name === "JsonWebTokenError") {
    error = new ApiError(401, "Invalid token");
  }

  // JWT expired
  if (err.name === "TokenExpiredError") {
    error = new ApiError(401, "Token expired");
  }


  console.log(err);
  
  res.status(error.statusCode).json({
    success: false,
    error: error.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandlerMiddleware;
