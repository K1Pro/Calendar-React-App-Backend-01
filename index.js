const fs = require("fs");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const authRoutes = require("./routes/auth");

const app = express();

const contacts = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/contacts.json`)
);

app.get("/api/v2/contacts", (req, res) => {
  res.status(200);
  res.json({ status: "success", results: contacts.length, data: { contacts } });
});

app.post("/api/v2/contacts", (req, res) => {
  res.send("You can post to this endpoint");
});

const port = 8000;

app.listen(port, () => console.log("Barts server is running on port 8000"));

// mongooose mongoDB connection
mongoose
  .connect(
    "mongodb://192.168.64.9:27017/"
    // , {
    //   useNewUrlParser: true,
    //   useCreateIndex: true,
    //   useFindAndModify: false,
    //   useUnifiedTopology: true,
    // }
  )
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => console.log("DB CONNECTION ERROR", err));

app.use(
  cors({
    origin: ["http://192.168.64.9:3000"],
  })
);

app.use(morgan("dev"));

// routes middleware
app.use("/api", authRoutes);
