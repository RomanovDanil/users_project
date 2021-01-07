//импорт пакета express
const express = require("express");
//импорт вакета mongoose
const mongoose = require("mongoose");
//импорт пакета config
const config = require("config");
//прасер запросов
const bodyParser = require("body-parser");
const cors = require("cors");

//инициализация сервера
server = express();
//параметры сервера
const port = config.get("server.port") || 5000;
const hostname = config.get("server.hostname") || "localhost";

server.use(cors());
server.use(express.static("./uploads"));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

//обработка запросов с доверенных серверов
server.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Accept, Content-Type, Authorization, x-www-form-urlencoded"
  );
  res.header("Access-Control-Allow-Credentials", true);
  return next();
});

server.use("/api/auth", require("./routes/auth_routes"));
server.use("/api/user", require("./routes/user_routes"));
server.use("/api/country", require("./routes/country_routes"));
server.use("/api/role", require("./routes/role_routes"));
server.use("/api/event", require("./routes/event_routes"));
server.use("/api/document", require("./routes/document_routes"));

//подключение к mongodb и запуск сервера
async function start() {
  try {
    await mongoose.connect(config.get("mongodb.uri"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    server.listen(port, hostname);
    console.log(`Server has been started on port: ${port}`);
  } catch (e) {
    console.log("Server error", e.message);
    process.exit(1);
  }
}

start();
