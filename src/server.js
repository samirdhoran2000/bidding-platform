// src/server.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
require("dotenv").config();
const { sequelize } = require("./models");
const userRoutes = require("./routes/userRoutes");
const itemRoutes = require("./routes/itemRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const auth = require("./middlewares/auth");

app.use(express.json());
app.use("/users", userRoutes);
app.use("/items", itemRoutes);
app.use("/notifications", notificationRoutes);

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await sequelize.authenticate();
  console.log("Database connected");
});
