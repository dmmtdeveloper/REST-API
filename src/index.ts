import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import routes from "./routes/index"

const app = express();
app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
  console.log("server is running on http://localhost:8080");
});

const MONOGO_URL = ""; // Insertar aca la url de mongodb
mongoose.Promise = Promise;
mongoose.connect(MONOGO_URL);
mongoose.connection.on("error", (error: Error) => {
  console.log("error");
});

app.use("/", routes());