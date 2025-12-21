import express from "express"
import DataBase from "./DB/connection.js"
import routerHandler from "./Utils/routerHandler.utils.js"
import  dotenv  from "dotenv"
import cors from "cors";


dotenv.config()



  
  const bootstrap = () =>{
    const app = express()
   
// for connection with front end 
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());



    // database
    DataBase()

    // test for production
    app.get( "/test" , async (req , res,next ) =>{ if(req.params.value == "prod" ){ return next("router") }   res.status(200).json(  {message : "hello from prod test production " ,mms:req.xhr  } )    } )



    //all the routers
    routerHandler( app ,express ) 




    const server = app.listen( process.env.PORT || 3000 , (error) =>{
      if (error) {
       throw error // e.g. EADDRINUSE
        }
         console.log(`Listening on =========> ${JSON.stringify(server.address())}`)
        
    })

} 


export default bootstrap


