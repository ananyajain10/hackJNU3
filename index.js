import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

import AuthRoutes from "./Routes/AuthRoutes.js";

const app = express();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

dotenv.config();

const connectionUrl = process.env.URL;
const port = process.env.PORT

mongoose
  .connect(connectionUrl)
  .then(() => console.log("db connected"))
  .catch((error) => console.log(`${error} did not connect`));


app.use("/auth", AuthRoutes);
app.listen(port, () => console.log(`listening on port ${port}`));        