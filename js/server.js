import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import path from 'path';
import express from 'express';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const port = 8080;

// Connect to MongoDB
const dbUsername = process.env.DB_username;
const dbPassword = process.env.DB_password;
const dbServer = process.env.DB_server;

const uri = `mongodb+srv://${dbUsername}:${dbPassword}@${dbServer}/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverAPI: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
    }
});

let database;
let users;
// Connect to database
async function connectToDatabase() {
    try {
        await client.connect();
        database = client.db("Polchess");
        users = database.collection("Users");
        console.log("Connected to the database");
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}

connectToDatabase();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, '../')));


app.use(express.json());

// Main route
app.get('/M00864763/', (req, res) => {
    res.sendFile(path.join(__dirname, '../html/index.html'));
});

// USer post and return it in doomer
app.post('/M00864763/addUser', async (req, res) => {
    const specificUser = {
        username: "M00864763",
        bio: "Maciej Ciba",
        email: "mc2084@live.mdx.ac.uk",
        location: "London, UK"
    };

    try {
        const result = await users.insertOne(specificUser);
        if (result.acknowledged) {

            const newUser = await users.findOne({ _id: result.insertedId });
            res.status(201).json(newUser);
        } else {
            res.status(500).json({ message: "Error creating a user" });
        }
    } catch (error) {
        res.status(500).json({ message: "Errora", error: error.message });
    }
});
//my user ID
app.get('/M00864763/getUser', async (req, res) => {
    try {
        const username = "M00864763";
        const query = { username: username };
        const user = await users.findOne(query);

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving user", error: error.message });
    }
});
// All IDs
app.get('/M00864763/getAllUsers', async (req, res) => {
    try {
        const allUsers = await users.find({}).toArray();
        res.status(200).json(allUsers);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving users", error: error.message });
    }
});


// Start the server
app.listen(port, () => {
    console.log(uri);
    console.log(`Server running on http://127.0.0.1:${port}/M00864763`);
});