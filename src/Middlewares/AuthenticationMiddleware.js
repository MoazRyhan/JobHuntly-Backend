import  jwt  from 'jsonwebtoken';
// import { BlacklistToken_Model } from './../DB/models/BlackList_token_model.js';
import User_model from '../DB/Models/User_model.js';




export const AuthenticationMiddleware = () => {
  return async (req, res, next) => {
    try {
      const { access_token } = req.headers;

      if (!access_token) {
        return res.status(401).json({ message: "please login first" });
      }

      // decode the data
      const decoding_access_token = jwt.verify(
        access_token,
        process.env.JWT_ACCESS_TOKEN_SECRET_KEY
      );

      // find the data
      const user = await User_model.findById(
        decoding_access_token.id,
        "-password -__v"
      );
      if (!user) {
        return res.status(404).json({ message: "this user is not found" });
      }

      console.log(user._doc);

      req.login_user = {
        ...user._doc,
        token: {
          token_id: decoding_access_token.jti,
          expiration_data: decoding_access_token.exp,
        },
      };

      next();
    } catch (error) {
      console.log(
        "internal authentication middleware error  ==========>",
        error
      );
      res
        .status(500)
        .json({
          message: "internal authentication middleware error====>",
          error,
        });
    }
  };
};





//             ===================   still under test for black list  ========================
export const AuthorizationMiddleware = (allow_role) =>{
    return async ( req , res , next ) =>{
 
        try {
            const { access_token } = req.headers

            // decode the data
            const decoding_access_token = jwt.verify(access_token , process.env.JWT_ACCESS_TOKEN_SECRET_KEY)

            // check if in black list
            const if_black_list = await BlacklistToken_Model.findOne({ where : { token_id:decoding_access_token.jti } })
            if ( if_black_list) {return res.status(401).json({ message :"this token is expired please login again"  }) }

            // find the data
            const User = await User_model.findByPk(decoding_access_token.id  )
            if (!User) { return res.status(404).json({ message :"this user is not found" }) }
            
            // console.log( User  , "ddddddddddddd" );
            req.login_user = { ...User._doc , token:{  token_id:decoding_access_token.jti , expiration_data:decoding_access_token.exp } }
            // console.log( req.login_user );
            
            
            next()
        } catch (error) {
            console.log(  "internal authorization middleware  error=====>" , error );
            res.status(500).json({ message : "internal authorization middleware  error====>" , error })
        }

    }
}






