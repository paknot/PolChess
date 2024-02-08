require('dotenv').config(); // Load .env file
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = 8080;
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
app.use(express.static(__dirname)); 
// Home
app.get('/M00864763', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
//   Login
app.get('/M00864763/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});



app.listen(port, () => {
    console.log(`Server running on http://127.0.0.1:${port}/M00864763`);
});

async function find() {
    try {
        await users.createIndex({ name: "text" });
        const query = { $text: { $search: "Ciba" } };
        const results = await users.find(query).toArray();
        console.log(results);
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await client.close();
    }
}
find();

