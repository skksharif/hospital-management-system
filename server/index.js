const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
connectDB();
const app = express();


app.use(cors());
app.use(express.json());


const authRoutes = require("./routes/auth");
const doctorRoutes = require("./routes/doctor");

app.use("/api", authRoutes);
app.use("/api/doctor",doctorRoutes);


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
