// Modules
require("dotenv").config();
const http = require("http");

// Files
const app = require('./src/app');
const config = require('./src/config/config');
const db = require('./src/config/db.config');

// Create Server
const server = http.createServer(app);

// Initialize Server
server.listen(config.port, () => {
     console.log(`Server is running at ${config.port}`);
});

// Socket Initialization
require('./src/utils/socket').initializeSocket(server);