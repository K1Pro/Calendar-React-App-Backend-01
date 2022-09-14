// const http = require("http");

// const server = http.createServer(function (req, res) {
//   res.writeHead(200, { "Content-Type": "text/html" });
//   res.end("Contacts Manager v2.0");
// });

// server.listen(8000);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

// const myMiddleware = (req, res, next) => {
//   console.log("!!Middleware applied!!");
//   next();
// };
// app.use(myMiddleware);

//mongo db connection
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

app.get("/api/users", function (req, res) {
  res.json({
    users: [
      {
        name: "Bartosz",
        age: 34,
      },
      {
        name: "Joanna",
        age: 33,
      },
    ],
  });
  // const bartkatest = "you guess it";
  // const { MongoClient } = require("mongodb");
  // // Connection URI
  // const uri = "mongodb://192.168.64.9:27017/";
  // // Create a new MongoClient
  // const client = new MongoClient(uri);
  // async function run() {
  //   try {
  //     // Connect the client to the server (optional starting in v4.7)
  //     await client.connect();
  //     // Establish and verify connection
  //     await client.db("admin").command({ ping: 1 });
  //     console.log("Connected successfully to server");
  //   } finally {
  //     // Ensures that the client will close when you finish/error
  //     await client.close();
  //   }
  // }
  // run().catch(console.dir);

  // res.send(`hello from ${client} node api`);
});

app.listen(8000, () => console.log("Barts server is running on port 8000"));
