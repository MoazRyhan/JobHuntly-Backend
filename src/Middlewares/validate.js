
import ApiError from "../Utils/ApiError.utils.js"

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const message = error.details
        .map((detail) => detail.message)
        .join(", ");

      throw new ApiError(400, message);
    }

    next();
  };
};

export default validate;
