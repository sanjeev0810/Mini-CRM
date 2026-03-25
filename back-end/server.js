require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/leads", require("./routes/leads"));
app.use("/api/companies", require("./routes/companies"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/dashboard", require("./routes/dashboard"));

app.listen(5000, () => console.log("Server running"));