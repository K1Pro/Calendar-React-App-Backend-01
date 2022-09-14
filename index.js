console.log("Bart is just testing again");

// const http = require("http");

// const server = http.createServer(function (req, res) {
//   res.writeHead(200, { "Content-Type": "text/html" });
//   res.end("Contacts Manager v2.0");
// });

// server.listen(8000);

const express = require("express");
const app = express();

app.get("/api", function (req, res) {
  res.json({
    user: {
      name: "Bart",
      age: 30,
    },
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
