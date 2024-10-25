// Modules
const { Server } = require("socket.io");

// Models
const {
     User,
     SocketIds,
     UserSession
} = require('../models');


// Add socket id
const addSocketId = async (userId, socketId) => {
     try {
          await SocketIds.create({
               user_id: userId,
               socket_id: socketId
          });
     } catch (error) {
          console.error("Error adding socket ID:", error);
     }
};

// Remove socket id
const removeSocketId = async (socketId) => {
     try {
          await SocketIds.deleteOne({
               socket_id: socketId
          });
     } catch (error) {
          console.error("Error removing socket ID:", error);
     }
};

// Get socket ids
const getSocketIds = async (userId) => {
     try {
          return await SocketIds.find({
               user_id: userId
          }, "socket_id").then((data) => {
               return data.map((item) => item.socket_id);
          })
     } catch (error) {
          console.error("Error fetching socket IDs:", error);
          return [];
     }
};


/**
 *  Socket Initialization
 */
const initializeSocket = (server) => {

     // Socket Server
     const io = new Server(server, {
          cors: {
               origin: "*",
          },
     });

     // Middleware for authentication
     io.use(async (socket, next) => {
          try {
               // Extract token from headers
               const token = socket.handshake.headers.authorization;
               if (!token) {
                    return next(new Error("Unauthorized. No token provided."));
               }

               // Validate user session
               const userSession = await UserSession.findOne({ token: token });
               if (!userSession) {
                    return next(new Error("Unauthorized. Invalid session."));
               }

               // Fetch user details
               const user = await User.findOne({ _id: userSession.user_id }, '_id');
               if (!user) {
                    return next(new Error("Unauthorized. User not found."));
               }

               // Attach user details to socket and add socket ID to DB
               await addSocketId(user._id, socket.id);

               socket.user = {
                    user_id: user._id,
                    socket_id: socket.id
               };

               next();
          } catch (error) {
               console.error("Error during socket authentication:", error);
               return next(new Error("Unauthorized. An error occurred."));
          }
     });

     // Socket Connection
     io.on("connection", async (socket) => {
          console.log("Socket Connected", socket.id);
          // console.log('socket.user', socket.user)

          socket.on("disconnect", async () => {
               console.log("Socket Disconnected", socket.id);

               // Remove socket id
               await removeSocketId(socket.id);
          });
     });

     // Set IO to global if needed to use in other files and controllers
     // global.io = io;

     return io;
};


module.exports = {
     initializeSocket
};