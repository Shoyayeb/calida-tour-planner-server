const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const email = require("mongodb").email;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4f4qc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("tourplan");
    const plansCollection = database.collection("plans");
    const bookedCollection = database.collection("bookedPlans");

    // GET API ---all plan
    app.get("/plans", async (req, res) => {
      const cursor = plansCollection.find({});
      const plans = await cursor.toArray();
      res.send(plans);
    });

    // GET ONE API
    app.get("/plans/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting ", id);
      const query = { _id: ObjectId(id) };
      const plan = await plansCollection.findOne(query);
      res.json(plan);
    });

    // GET API ---booked plans
    app.get("/bookedplans", async (req, res) => {
      const cursor = bookedCollection.find({});
      const plans = await cursor.toArray();
      res.send(plans);
    });

    // GET API ---booked plans by id
    app.get("/bookedplans/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const plan = await bookedCollection.findOne(query);
      res.json(plan);
    });

    // GET API ---booked plans by user email
    app.get("/mybookedplans/:id", async (req, res) => {
      const id = req.params.id;
      const query = { email: email(id + "@gmail.com") };
      const plan = await bookedCollection.findOne(query);
      res.json(plan);
    });

    // POST API ---for adding new plans
    app.post("/plans", async (req, res) => {
      const plan = req.body;
      console.log(plan);
      const result = await plansCollection.insertOne(plan);
      console.log(result);
      res.json(result);
    });

    // POST API ---for booking plan
    app.post("/bookplan", async (req, res) => {
      const plan = req.body;
      console.log(plan);
      const result = await bookedCollection.insertOne(plan);
      console.log(result);
      res.json(result);
    });

    // update api
    app.put("/updateplan/:id", async (req, res) => {
      const id = req.params.id;
      console.log("updating user", id);
      const updatedUser = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email,
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );

      res.send(result);
    });
    app.put("/myorders/updateplan/:id", async (req, res) => {
      const id = req.params.id;
      console.log("updating user", id);
      const updatedUser = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email,
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );

      res.send(result);
    });

    // DELETE API
    app.delete("/plans/:id", async (req, res) => {
      const id = req.params.id;
      const querry = { _id: ObjectId(id) };
      const result = await bookedCollection.deleteOne(querry);
      console.log(result);
      console.log("deleting user with id", id);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is perfectly running");
});

app.listen(port, () => {
  console.log("Running server on", port);
});
