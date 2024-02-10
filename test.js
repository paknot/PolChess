require('dotenv').config(); // Load .env file
const express = require('express');
const path = require('path');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = 8080;
// Connect to MongoDB
const dbUsername = process.env.DB_username;
const dbPassword = process.env.DB_password;
const dbServer = process.env.DB_server;

const uri = `mongodb+srv://${dbUsername}:${dbPassword}@${dbServer}/?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, {
    serverAPI: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
    }
});

// Database and user declaration
const database = client.db("Polchess");
const users = database.collection("Users");

app.use(express.static(__dirname));

// Home
app.get('/M00864763', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Login
app.get('/M00864763/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/M00864763/error', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Serve the same index.html
});

// API endpoint to get user data
app.get('/api/users/:username', async (req, res) => {
    const username = req.params.username;
    
    try {
        await client.connect();
        const user = await users.findOne({ username: username }); 

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        
        await client.close();
    }
});

// Dynamic route for user profiles
app.get('/M00864763/:username', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); 
});
//Where we running at
app.listen(port, () => {
    console.log(`Server running on http://127.0.0.1:${port}/M00864763`);
});
