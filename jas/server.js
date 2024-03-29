import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import path from 'path';
import express from 'express';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import multer from 'multer';
import { Binary } from 'mongodb';

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

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: uri }), // Use the same URI you use for MongoDB
    cookie: { secure: !!(process.env.NODE_ENV === 'production'), maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

app.use(express.static(path.join(__dirname, '../')));
app.use(express.json());

app.use(session({
    secret: 'your-secret-key', // Use a secret key for your sessions
    resave: false,
    saveUninitialized: true,
    cookie: { secure: !!(process.env.NODE_ENV === 'production') } // Use secure cookies in production
  }));

// Main route
app.get('/M00864763/', (req, res) => {
    res.sendFile(path.join(__dirname, '../html/index.html'));
});

//Register
app.post('/M00864763/addUser', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Use a case-insensitive search to check if the username already exists
        const existingUser = await users.findOne({ username: { $regex: new RegExp("^" + username + "$", "i") } });
        if (existingUser) {
            // If a user with the same username (ignoring case) is found, return an error response
            return res.status(400).json({ message: "Username already exists. Please choose a different username or sign in." });
        }

        // If the username doesn't exist (considering case-insensitivity), proceed to insert the new user
        const result = await users.insertOne({ username, email, password });
        if (result.acknowledged) {
            res.status(201).json({ id: result.insertedId, message: "Registration succesfull" });
        } else {
            res.status(500).json({ message: "Failed to register the user" });
        }
    } catch (error) {
        console.error("Error", error);
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

//Post new post

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/M00864763/createPost', upload.single('image'), async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "You must be logged in to create a post." });
    }

    const username = req.session.user;
    const { textContent } = req.body;
    const imageBuffer = req.file ? req.file.buffer : null;
    const contentType = req.file ? req.file.mimetype : null;

    try {
        const contentCollection = database.collection("Content");
        const result = await contentCollection.insertOne({
            username,
            textContent,
            image: imageBuffer ? new Binary(imageBuffer) : null,
            contentType,
            createdAt: new Date(),
        });

        if (result.acknowledged) {
            res.status(201).json({ message: "Post created successfully", postId: result.insertedId });
        } else {
            res.status(500).json({ message: "Failed to create post" });
        }
    } catch (error) {
        console.error("Error", error);
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

//Get all posts
app.get('/M00864763/getAllPosts', async (req, res) => {
    try {
        const contentCollection = database.collection("Content");
        const posts = await contentCollection.find({}).toArray();

        // Convert the Binary data to a Base64 string for each post that has an image
        const postsWithImages = posts.map(post => {
            if (post.image) {
                // Convert the Binary data to a Base64 string
                post.imageURL = `data:${post.contentType};base64,${post.image.buffer.toString('base64')}`;
            }
            return post;
        });

        res.status(200).json(postsWithImages);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving posts", error: error.message });
    }
});

//Log in
app.post('/M00864763/login', async (req, res) => {
    const { user, password } = req.body; // Assuming 'user' is the field for username in your form

    try {
        const userDocument = await users.findOne({ username: user });

        if (userDocument && userDocument.password === password) {
            // Assuming passwords are stored in plain text for simplicity; in a real application, use hashed passwords
            req.session.user = userDocument.username; // Start a session for the logged-in user
            res.json({ loggedIn: true, username: userDocument.username });
        } else {
            res.status(401).json({ message: "Invalid username or password." });
        }
    } catch (error) {
        console.error("Login error", error);
        res.status(500).json({ message: "An error occurred during login", error: error.message });
    }
});

// Check if logged in 
app.get('/M00864763/checkLogin', (req, res) => {
    if (req.session.user) {
        // User is logged in
        res.json({ loggedIn: true, username: req.session.user });
    } else {
        // User is not logged in
        res.json({ loggedIn: false });
    }
});

//Log out
app.post('/M00864763/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('Session destruction error:', err);
            return res.status(500).send('An error occurred while logging out.');
        }
        res.send({ message: 'Logged out successfully' });
    });
});

const profileUpload = multer({ storage: multer.memoryStorage() });

app.post('/M00864763/updateProfile', profileUpload.single('profilePicture'), async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "You must be logged in to update your profile." });
    }

    const username = req.session.user;
    const { bio, ChessRating, location } = req.body;
    const profilePicture = req.file ? new Binary(req.file.buffer) : null;

    // Validate ChessRating
    const chessRating = parseInt(ChessRating);
    if (isNaN(chessRating) || chessRating < 1000 || chessRating > 2800) {
        return res.status(400).json({ message: "Chess rating must be between 1000 and 2800." });
    }

    try {
        const updateDoc = {
            $set: {
                bio,
                ChessRating: chessRating,
                location,
            },
        };

        // If there's a profile picture, add it to the update document
        if (profilePicture) {
            updateDoc.$set.profilePicture = profilePicture;
        }

        const result = await users.updateOne({ username }, updateDoc);

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "User not found or data is the same as before." });
        }

        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error("Error updating profile", error);
        res.status(500).json({ message: "An error occurred during profile update", error: error.message });
    }
});

app.get('/M00864763/profilePicture/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await users.findOne({ _id: new ObjectId(userId) });
        
        if (!user || !user.profilePicture) {
            return res.status(404).send('No profile picture found.');
        }

        res.setHeader('Content-Type', 'image/png'); // Set the appropriate content type for your image
        res.send(user.profilePicture.buffer); // Send the image data as binary
    } catch (error) {
        console.error("Error serving profile picture:", error);
        res.status(500).send('Server error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(uri);
    console.log(`Server running on http://127.0.0.1:${port}/M00864763`);
});