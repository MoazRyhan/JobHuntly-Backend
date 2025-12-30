import UserModel from "../DB/Models/UserModel.js";
import { verifyAccessToken } from "../Utils/tokens.utils.js";

export const AuthenticationMiddleware = () => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({ message: "please login first" });
      }

      // Bearer <token>
      const token = authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "invalid token format" });
      }

      const decoded = verifyAccessToken(token);

      const user = await UserModel.findById(
        decoded.userId,
        "-password -__v"
      );

      if (!user) {
        return res.status(401).json({ message: "user not found" });
      }

      req.login_user = {
        ...user._doc,
        token: {
          token_id: decoded.jti,
          expiration_date: decoded.exp,
        },
      };

      next();
    } catch (error) {
      return res.status(401).json({
        message: "invalid or expired access token",
      });
    }
  };
};

//             ===================   it's work now  ========================

export const AuthorizationMiddleware = (allow_role = []) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "access token is required" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = verifyAccessToken(token);

      const user = await UserModel.findById(
        decoded.userId,
        "-password -__v"
      );

      if (!user) {
        return res.status(401).json({ message: "user not found" });
      }

      if (allow_role.length && !allow_role.includes(user.role)) {
        return res.status(403).json({
          message: "you are not allowed to access this api",
        });
      }

      req.login_user = {
        ...user._doc,
        token: {
          token_id: decoded.jti,
          expiration_date: decoded.exp,
        },
      };

      next();
    } catch (error) {
      if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "invalid or expired token" });
      }

      return res.status(500).json({ message: "authorization error" });
    }
  };
};



export const OptionalAuthenticationMiddleware = () => {
  return async (req, res, next) => {
    try {
      const { access_token } = req.headers
      if (!access_token) {
        // No token → guest
        req.login_user = null
        return next()
      }

      const decoding_access_token = verifyAccessToken(access_token)

      const user = await UserModel.findById(
        decoding_access_token.userId,
        '-password -__v'
      )
      if (!user) {
        req.login_user = null
        return next()
      }

      req.login_user = {
        ...user._doc,
        token: {
          token_id: decoding_access_token.jti,
          expiration_data: decoding_access_token.exp,
        },
      }

      next()
    } catch (error) {
      console.log('optional auth middleware error:', error)
      req.login_user = null // treat as guest if something goes wrong
      next()
    }
  }
}
