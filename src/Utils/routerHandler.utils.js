
import errorHandlerMiddleware from "../Middlewares/ErrorHandlerMiddleware.js";
import AuthRouter from "../Modules/auth/auth.routes.js"





const routerHandler = async (app , express  ) => {


    app.use( express.json() )
    app.use(errorHandlerMiddleware);

    app.use( "/auth" ,  AuthRouter )





    app.use(  '/{*any}', (req , res ) => {  
        res.status(404).json( { message : "this Router is not found" } )
     }  )

}












export default routerHandler