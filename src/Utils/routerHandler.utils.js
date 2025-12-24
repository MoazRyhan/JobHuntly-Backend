import errorHandlerMiddleware from "../Middlewares/ErrorHandlerMiddleware.js";
import AuthRouter from "../Modules/auth/auth.routes.js"
import MahmoudRouter from "../Modules/mahmoud/mahmoud.routes.js"; 
import cors from "cors";




const routerHandler = async (app , express  ) => {

    app.use(cors());
    app.use( express.json() )
    
    app.use( "/auth" ,  AuthRouter )
    app.use( "/settings" ,  SettingsRouter )
    
    app.use("/api", MahmoudRouter);  

    
    
    
    app.use(  '/{*any}', (req , res ) => {  
        res.status(404).json( { message : "this Router is not found" } )
    }  )
    
    app.use(errorHandlerMiddleware);
}

export default routerHandler
