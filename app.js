const fs = require("fs");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const authRoutes = require("./routes/auth");
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

const contacts = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/contacts.json`)
);

const getAllContacts = (req, res) => {
  console.log(req.requestTime);
  res.status(200);
  res.json({
    status: "success",
    requestedAt: req.requestTime,
    results: contacts.length,
    data: { contacts },
  });
};
const getContact = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const contact = contacts.find((el) => el.id === id);
  if (!contact) {
    return res.status(404).json({ status: "fail", message: "Invalid ID" });
  }

  res.status(200);
  res.json({
    status: "success",
    data: { contact },
    // results: contacts.length, data: { contacts }
  });
};
const createContact = (req, res) => {
  // console.log(req.body);
  const newID = contacts[contacts.length - 1].id + 1;
  const newContact = Object.assign({ id: newID }, req.body);
  contacts.push(newContact);
  fs.writeFile(
    `${__dirname}/dev-data/data/contacts.json`,
    JSON.stringify(contacts),
    (err) => {
      res
        .status(201)
        .json({ status: "success", data: { contact: newContact } });
    }
  );
};
const updateContact = (req, res) => {
  if (req.params.id * 1 > contacts.length) {
    return res.status(404).json({ status: "fail", message: "Invalid ID" });
  }
  res.status(200).json({
    status: "success",
    data: { contact: "<Updated contact here...>" },
  });
};
const deleteContact = (req, res) => {
  if (req.params.id * 1 > contacts.length) {
    return res.status(404).json({ status: "fail", message: "Invalid ID" });
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
};
// this is the same as the routes below:
// app.get("/api/v2/contacts", getAllContacts);
// app.get("/api/v2/contacts/:id/:x?", getContact);
// app.post("/api/v2/contacts", createContact);
// app.patch("/api/v2/contacts/:id", updateContact);
// app.delete("/api/v2/contacts/:id", deleteContact);
// prettier-ignore
app
  .route("/api/v2/contacts")
  .get(getAllContacts)
  .post(createContact);

// prettier-ignore
app
  .route("/api/v2/contacts/:id/:x?")
  .get(getContact)
  .patch(updateContact)
  .delete(deleteContact)

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
