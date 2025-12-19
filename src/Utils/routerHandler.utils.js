
import errorHandlerMiddleware from "../Middlewares/ErrorHandlerMiddleware.js";
import AuthRouter from "../Modules/auth/auth.routes.js"
import MahmoudRouter from "../Modules/mahmoud/mahmoud.routes.js"; 





const routerHandler = async (app , express  ) => {


    app.use( express.json() )
    
    app.use( "/auth" ,  AuthRouter )
    
    app.use("/api", MahmoudRouter);  

    
    
    
    app.use(  '/{*any}', (req , res ) => {  
        res.status(404).json( { message : "this Router is not found" } )
    }  )
    
    app.use(errorHandlerMiddleware);
}












export default routerHandler