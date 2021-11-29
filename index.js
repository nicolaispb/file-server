const { PORT } = require("./config");
const { success, error, log, app_request } = require("./utils/logger");
const path = require("path");

const { createServer } = require("https");
const { readFileSync } = require("fs");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const serveIndex = require('serve-index')
const compression = require("compression");
const upload = require("./middlewares/upload");
const app = express("/");
app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(compression());

// app.use("/uploads", serveIndex(path.join(__dirname, "/uploads"))) //// for dev
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use("/uploads", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "/error.png"));
});

app.all("*", (req, res, next) => {
  app_request({
    method: req.method,
    url: req.url,
    query: req.query,
    body: req.body,
  })
  next()
});

app.get("/", (req, res) => {
  res.json({
    status: "work",
    message: "",
  });
});

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const imageSrc = req.file ? `${req.file.destination}${req.file.filename}` : false;
    if (imageSrc) {
      log("Загружен файл:", imageSrc);
      return res.status(200).json({
        status: "ok",
        message: "Файл успешно загружен",
        imageSrc: `https://instinctbalance.ru:49158/${imageSrc.replace("\\", "/")}`,
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "Загрузите файл",
      });
    }
  } catch (e) {
    error(e);
    return res.send(500).json({
      status: "error",
      message: "Неизвестная ошибка при загрузке файла",
    });
  }
});

app.get("*", (req, res) => {
  res.redirect("/");
});

try {
  createServer(
    {
      cert: readFileSync(
        path.join("/etc/nginx/ssl/instinctbalance.ru.crt")
      ),
      key: readFileSync(
        path.join("/etc/nginx/ssl/instinctbalance.ru.key")
      ),
    },
    app
  ).listen(PORT, () => {
    success(`START SERVER ON PORT ${PORT}`);
  })
} catch (e) {
  error(e);
}
