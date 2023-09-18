import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoute.js";
import donationRoutes from "./routes/donationRoutes.js";

//initialize app

const app = express();
dotenv.config({ path: "./config.env" });

connectDB();

//midlewares
app.use(cors());
app.use(express.static('./public'));
app.use(morgan("dev"));
app.use(express.json());

// console.log(process.env.XYZ);

//end-points
app.use("/api/users", userRoutes);
app.use("/api/donations", donationRoutes);

app.listen(8000, () => {
    console.log("server is running on 8000");
});
