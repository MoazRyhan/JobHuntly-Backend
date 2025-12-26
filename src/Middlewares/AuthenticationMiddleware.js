import UserModel from '../DB/Models/UserModel.js'
import { verifyAccessToken } from '../Utils/tokens.utils.js'

export const AuthenticationMiddleware = () => {
  return async (req, res, next) => {
    try {
      const { access_token } = req.headers

      if (!access_token) {
        return res.status(401).json({ message: 'please login first' })
      }

      // decode the data
      const decoding_access_token = verifyAccessToken(access_token)

      console.log(decoding_access_token)

      // find the data
      const user = await UserModel.findById(
        decoding_access_token.userId,
        '-password -__v'
      )
      if (!user) {
        return res.status(404).json({ message: 'this user is not found' })
      }

      // console.log(user._doc);

      req.login_user = {
        ...user._doc,
        token: {
          token_id: decoding_access_token.jti,
          expiration_data: decoding_access_token.exp,
        },
      }

      next()
    } catch (error) {
      console.log(
        'internal authentication middleware error  ==========>',
        error
      )
      res.status(500).json({
        message: 'internal authentication middleware error====>',
        error,
      })
    }
  }
}

//     ===================   it's work now  ========================

export const AuthorizationMiddleware = (allow_role = []) => {
  return async (req, res, next) => {
    try {
      const { access_token } = req.headers

      if (!access_token) {
        return res.status(401).json({ message: 'access token is required' })
      }

      // decode token
      const decoding_access_token = verifyAccessToken(access_token)

      console.log(decoding_access_token)
      // find user
      const User = await UserModel.findById(
        decoding_access_token.userId,
        '-password -__v'
      )

      if (!User) {
        return res.status(404).json({ message: 'this user is not found' })
      }

      // 🔥 ROLE CHECK
      if (allow_role.length > 0 && !allow_role.includes(User.role)) {
        return res.status(403).json({
          message: 'you are not allowed to access this api',
        })
      }

      // attach user to request
      req.login_user = {
        ...User._doc,
        token: {
          token_id: decoding_access_token.jti,
          expiration_data: decoding_access_token.exp,
        },
      }

      next()
    } catch (error) {
      console.log('internal authorization middleware error ====>', error)
      return res.status(401).json({
        message: 'invalid or expired token',
      })
    }
  }
}

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
