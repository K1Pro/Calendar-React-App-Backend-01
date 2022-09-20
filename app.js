const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const authRoutes = require("./routes/auth");
const contactRouter = require("./routes/contactRoutes");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = express();

// Middleware

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
// this is the same as the routes below:
// app.get("/api/v2/contacts", getAllContacts);
// app.get("/api/v2/contacts/:id/:x?", getContact);
// app.post("/api/v2/contacts", createContact);
// app.patch("/api/v2/contacts/:id", updateContact);
// app.delete("/api/v2/contacts/:id", deleteContact);
app.use("/api/v2/contacts", contactRouter);

const port = process.env.PORT || 8000;

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

// routes middleware
app.use("/api", authRoutes);
