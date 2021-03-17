const express = require("express");
const Middleware = require("./middleware/middleware");
const userRouter = require("./users/users-router");

const server = express();

// remember express by default cannot parse JSON in request bodies

server.use(express.json());
server.use(Middleware.logger);

// global middlewares and the user's router need to be connected here

server.use("/api/users", userRouter);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use((error, req, res, next) => {
  error.error && console.error(error.error);
  res.status(error.status).json({ message: error.message });
});

module.exports = server;
