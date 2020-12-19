//импорт пакета express
const express = require("express");
//импорт вакета mongoose
const mongoose = require("mongoose");
//импорт пакета config
const config = require("config");
//прасер запросов
const bodyParser = require("body-parser");

//инициализация сервера
server = express();
//параметры сервера
const port = config.get("server.port") || 5000;
const hostname = config.get("server.hostname") || "localhost";

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

//обработка запросов с доверенных серверов
server.use((req, res, next) => {
  // const allowedOrigins = ['http://127.0.0.1:8081', 'http://localhost:8081', 'http://127.0.0.1:8082', 'http://localhost:8082'];
  // const origin = req.headers.origin;
  // if (allowedOrigins.includes(origin)) {
  //     res.setHeader('Access-Control-Allow-Origin', origin);
  // }
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-access-token"
  );
  res.header("Access-Control-Allow-Credentials", true);
  return next();
});

server.use("/api/auth", require("./routes/auth_routes"));
server.use("/api/user", require("./routes/user_routes"));
server.use("/api/country", require("./routes/country_routes"));
server.use("/api/role", require("./routes/role_routes"));
server.use("/api/event", require("./routes/event_routes"));
server.use(express.static("uploads"));

//подключение к mongodb и запуск сервера
async function start() {
  try {
    await mongoose.connect(config.get("mongodb.uri"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
    });
    server.listen(port, hostname);
    console.log(`Server has been started on port: ${port}`);
  } catch (e) {
    console.log("Server error", e.message);
    process.exit(1);
  }
}

start();
