require('dotenv').config(); // Load .env file
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Connect to MongoDB
const dbUsername = process.env.DB_username;
const dbPassword = process.env.DB_password;
const dbServer = process.env.DB_server;

const uri = `mongodb+srv://${dbUsername}:${dbPassword}@${dbServer}/?
retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, {
    serverAPI: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
    }
});

const database = client.db("Polchess");
const users = database.collection("Users");

// async function insertOne(){
//     const me = {name: "Maciej Ciba", email: "mc2084@live.mdx.ac.uk", stuID: "M00864763"};
//     const result = await users.insertOne(me);
//     console.log(result);

//     await client.close();
// }

async function find() {
    try {
        await users.createIndex({ name: "text" });
        const query = { $text: { $search : "Ciba" } };
        const results = await users.find(query).toArray();
        console.log(results);
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await client.close();
    }
}
find();

