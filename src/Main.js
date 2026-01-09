import express from 'express'
import DataBase from './DB/connection.js'
import routerHandler from './Utils/routerHandler.utils.js'
import dotenv from 'dotenv'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import http from "http"
import { Server } from "socket.io"

dotenv.config()

  const general_rate_limit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  limit: 100,
  message: " Too many requests, slow down.",
  legacyHeaders: false,
  standardHeaders: true,
});
  

const bootstrap = () => {
  const app = express()

  // for connection with front end 
  app.use(
    cors({
      origin: ['http://localhost:5173', 'http://localhost:3001' , "*" ],
      credentials: true,
    })
  )

  // app.use(
  //   helmet({ xContentTypeOptions: false, crossOriginOpenerPolicy: true }) 
  // );
  // app.use(general_rate_limit);

  // Stripe webhook needs raw body BEFORE express.json() parses it
  // This must come before app.use(express.json())
  app.post(
    '/stripe/webhook',
    express.raw({ type: 'application/json' }),
    async (req, res, next) => {
      // This will be handled by the Stripe router
      next();
    }
  );

  app.use(express.json())
  app.use('/assets', express.static('Assets'))

  // database
  DataBase()

  // test for production
  app.get('/test', async (req, res, next) => {
    if (req.params.value == 'prod') {
      return next('router')
    }
    res
      .status(200)
      .json({ message: 'hello from prod test production ', mms: req.xhr })
  })

  //all the routers
  routerHandler(app, express)


  // Wrap the app in an HTTP Server
  const httpServer = http.createServer(app);

  // Initialize Socket.io
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  // Track users
  let activeUsers = {};

  io.on("connection", (socket) => {
    //console.log("A user connected:", socket.id);

    socket.on("register", (userId) => {
      activeUsers[userId] = socket.id;
      //console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    socket.on("disconnect", () => {
      // Remove user from active list
      for (const userId in activeUsers) {
        if (activeUsers[userId] === socket.id) {
          delete activeUsers[userId];
          break;
        }
      }
    });
  });

  // Export io and activeUsers so that controllers can use them
  app.set("io", io);
  app.set("activeUsers", activeUsers);


  // 7. Use httpServer.listen INSTEAD of app.listen
  const port = process.env.PORT || 3000;
  httpServer.listen(port, () => {
    console.log(`Server & Socket listening on port ${port}`);
    //console.log(`Listening on =========> ${JSON.stringify(server.address())}`)
  });


  // const server = app.listen(process.env.PORT || 3000, (error) => {
  //   if (error) {
  //     throw error // e.g. EADDRINUSE
  //   }
  //   console.log(`Listening on =========> ${JSON.stringify(server.address())}`)
  // })
}

export default bootstrap