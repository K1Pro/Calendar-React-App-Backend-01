exports.users = (req, res) => {
  // mongoDB connection
  const { MongoClient } = require("mongodb");
  // Connection URI
  const uri = "mongodb://192.168.64.9:27017/";
  // Create a new MongoClient
  const client = new MongoClient(uri);
  async function run() {
    try {
      const database = client.db("shop");
      const movies = database.collection("products");
      // Query for a movie that has the title 'Back to the Future'
      const query = { FirstName: "Adam" };
      // const movie = await movies.findOne(query);
      const allmovies = await movies.find(query);
      console.log(allmovies);
      res.json({ allmovies });
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  run().catch(console.dir);

  // //original
  //   res.json({
  //     users: [
  //       {
  //         name: "Bartosz",
  //         age: 34,
  //       },
  //       {
  //         name: "Joanna",
  //         age: 33,
  //       },
  //     ],
  //   });

  //just some tests
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
};
