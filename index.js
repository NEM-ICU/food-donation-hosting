import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoute.js";
import donationRoutes from "./routes/donationRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

//initialize App
const app = express();
dotenv.config({ path: "./config.env" });
console.log(__dirname);

connectDB();

//midlewares
app.use(cors());
app.use(express.static("./public"));

// Defined other pages

// Define routes for different pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/donations", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/admin-panel", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/donation-history", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/delivery", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/confirm-delivery", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/create-donation", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/donor-donation-history", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


app.use(morgan("dev"));
app.use(express.json());

// console.log(process.env.XYZ);

//end-points
app.use("/api/users", userRoutes);
app.use("/api/donations", donationRoutes);

app.listen(8000, () => {
  console.log("server is running on 8000");
});
