import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import express from 'express';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import session from 'express-session';
import multer from 'multer';
import { Binary } from 'mongodb';


const app = express();
const port = 8080;

// Connect to MongoDB using .env file
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
//Call the function to connect to db
connectToDatabase();


app.use(express.json());

app.use(session({
    secret: 'mySecret', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: !!(process.env.NODE_ENV === 'production') } //Secure cookies in production
  }));

app.use("/M00864763", express.static('public'));

//Register
app.post('/M00864763/addUser', async (req, res) => {
    const { username, email, password } = req.body;

    // Check if any of the required fields are missing
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Missing required fields. Please ensure username, email, and password are provided." });
    }

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
            res.status(201).json({ id: result.insertedId, message: "Registration successful" });
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
    //Must be logged in
    if (!req.session.user) {
        return res.status(401).json({ message: "You must be logged in to create a post." });
    }

    //Get image and username
    const username = req.session.user;
    const { textContent } = req.body;

    // Check if the textContent is provided
    if (!textContent) {
        return res.status(400).json({ message: "Missing text content. Please tell us something." });
    }

    //Image if any
    const imageBuffer = req.file ? req.file.buffer : null;
    const contentType = req.file ? req.file.mimetype : null;

    try {
        //Content collection
        const contentCollection = database.collection("Content");

        //Insert into database
        const result = await contentCollection.insertOne({
            username,
            textContent,
            image: imageBuffer ? new Binary(imageBuffer) : null,
            contentType,
            createdAt: new Date(),
            likeCount: 0,
        });

        //Inform user
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
        //Sorth posts,nwest first
        const posts = await contentCollection.find({}).sort({ createdAt: 1 }).toArray();

        //Convert binary
        const postsWithImages = posts.map(post => {
            if (post.image) {
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
    const { user, password } = req.body; 

    try {
        const userDocument = await users.findOne({ username: user });

        if (userDocument && userDocument.password === password) {
            //Password still stored in a plain text
            req.session.user = userDocument.username; 
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
// Update profile (picture, bio, location, rating)
const profileUpload = multer({ storage: multer.memoryStorage() });

app.post('/M00864763/updateProfile', profileUpload.single('profilePicture'), async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "You must be logged in to update your profile." });
    }
    //Get the data from form
    const username = req.session.user;
    const { bio, ChessRating, location } = req.body;
    const profilePicture = req.file ? new Binary(req.file.buffer) : null;

    let updateDoc = { $set: {} };

    if (bio) updateDoc.$set.bio = bio;
    if (location) updateDoc.$set.location = location;
    if (ChessRating) {
        const chessRating = parseInt(ChessRating);
        if (!isNaN(chessRating) && chessRating >= 1000 && chessRating <= 2800) {
            updateDoc.$set.ChessRating = chessRating;
        } else {
            return res.status(400).json({ message: "Chess rating must be between 1000 and 2800." });
        }
    }
    if (profilePicture) updateDoc.$set.profilePicture = profilePicture;

    if (Object.keys(updateDoc.$set).length === 0) {
        return res.status(400).json({ message: "No valid fields provided for update." });
    }
    //Update the same
    try {
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


// Friends list
app.get('/M00864763/friends', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "You must be logged in to see the friends list." });
    }
    try {
        const friendsCollection = database.collection("Friends");
        const friendsDocument = await friendsCollection.findOne({ username: req.session.user });
        

        if (!friendsDocument || !Array.isArray(friendsDocument.following)) {
            return res.status(404).json({ message: "Friends document not found or the following field is not an array." });
        }

        res.status(200).json(friendsDocument.following);
    } catch (error) {
        console.error("Error retrieving friends list from Friends collection", error);
        res.status(500).json({ message: "An error occurred while retrieving friends list", error: error.message });
    }
});
// User info ( bio, location, chess rating)
app.get('/M00864763/userInfo/:username', async (req, res) => {
    const username = req.params.username;

    try {
        const userDocument = await users.findOne({ username: username }, { projection: { bio: 1, location: 1, ChessRating: 1 } });
        if (userDocument) {
            // Return the necessary user details
            res.json({
                bio: userDocument.bio,
                location: userDocument.location,
                ChessRating: userDocument.ChessRating
            });
        } else {
            // User not found
            res.status(404).json({ message: "User not found." });
        }
    } catch (error) {
        console.error("Error fetching user information", error);
        res.status(500).json({ message: "An error occurred while fetching user information", error: error.message });
    }
});
// Follow users
app.post('/M00864763/followUser', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "You must be logged in to follow a user." });
    }

    const currentUser = req.session.user; // Username logged in
    const { usernameToFollow } = req.body; // Username user wahts to follow

    try {
        // Ensure the target user exists
        const targetUserExists = await users.findOne({ username: usernameToFollow });
        if (!targetUserExists) {
            return res.status(404).json({ message: "User to follow not found." });
        }

        // Update the current user's "following" list
        const friendsCollection = database.collection("Friends");
        await friendsCollection.updateOne(
            { username: currentUser },
            { $addToSet: { following: usernameToFollow } },
            { upsert: true }
        );

        // Update the target user's "followers" list
        await friendsCollection.updateOne(
            { username: usernameToFollow },
            { $addToSet: { followers: currentUser } },
            { upsert: true }
        );

        res.status(200).json({ message: `Successfully followed ${usernameToFollow}.` });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "An error occurred while trying to follow the user", error: error.message });
    }
});
// Fetch posts by username
app.get('/M00864763/getPostsByUsername/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const contentCollection = database.collection("Content");
        const posts = await contentCollection.find({ username: username }).toArray();
        const postsWithImages = posts.map(post => {
            if (post.image) {
                post.imageURL = `data:${post.contentType};base64,${post.image.buffer.toString('base64')}`;
            }
            return post;
        });
        res.status(200).json(postsWithImages);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving posts by username", error: error.message });
    }
});

// Fetch posts by hashtag
app.get('/M00864763/getPostsByHashtag/:hashtag', async (req, res) => {
    const hashtag = req.params.hashtag;
    if (!hashtag) {
        return res.status(400).json({ message: "Hashtag is required" });
    }

    try {
        const contentCollection = database.collection("Content");
        // Use a regular expression to search for the hashtag in the textContent field
        const posts = await contentCollection.find({ textContent: { $regex: hashtag, $options: 'i' } }).toArray();
        const postsWithImages = posts.map(post => {
            if (post.image) {
                post.imageURL = `data:${post.contentType};base64,${post.image.buffer.toString('base64')}`;
            }
            return post;
        });
        res.status(200).json(postsWithImages);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving posts by hashtag", error: error.message });
    }
});

// Send messgaes
app.post('/M00864763/sendMessage', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "You must be logged in to send messages." });
    }

    const { receiver, content } = req.body;
    const sender = req.session.user;

    // Check if content is not empty or just whitespace
    if (!content.trim()) {
        return res.status(400).json({ message: "Message content cannot be empty." });
    }

    try {
        // Check if receiver exists in the database
        const receiverExists = await database.collection("Users").findOne({ username: receiver });
        if (!receiverExists) {
            return res.status(404).json({ message: "Receiver not found." });
        }

        const result = await database.collection("Messages").insertOne({
            sender,
            receiver,
            content,
            createdAt: new Date(),
            isRead: false 
        });

        if (result.acknowledged) {
            res.status(201).json({ message: "Message sent successfully" });
        } else {
            res.status(500).json({ message: "Failed to send message" });
        }
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});


//Gets messages to display
app.get('/M00864763/getMessages', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "You must be logged in to view messages." });
    }
  
    try {
        const messagesCollection = database.collection("Messages");
        const messages = await messagesCollection.find({ receiver: req.session.user, isRead: { $ne: true } }).toArray();
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "An error occurred while fetching messages", error: error.message });
    }
});

// Mark messages as read

app.post('/M00864763/markMessageAsRead', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send("You must be logged in.");
    }

    const { messageId } = req.body;
    if (!messageId) {
        return res.status(400).send("Message ID is required.");
    }

    try {
        const messagesCollection = database.collection("Messages");
        const result = await messagesCollection.updateOne(
            { _id: new ObjectId(messageId), receiver: req.session.user },
            { $set: { isRead: true } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).send("Message not found or already marked as read.");
        }

        res.status(200).json({ message: "Message marked as read successfully." });
    } catch (error) {
        console.error("Error marking message as read:", error);
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});



// Gets users profile picture
app.get('/M00864763/getUserProfilePicture/:username', async (req, res) => {
    const username = req.params.username;

    try {
        const userDocument = await users.findOne({ username: username }, { projection: { profilePicture: 1 } });
        if (userDocument && userDocument.profilePicture) {
            res.contentType('image/png');
            res.send(userDocument.profilePicture.buffer);
        } else {
            res.status(404).json({ message: "Profile picture not found." });
        }
    } catch (error) {
        console.error("Error fetching profile picture", error);
        res.status(500).json({ message: "An error occurred while fetching the profile picture", error: error.message });
    }
});


//Get puzzles and validate them
app.get('/M00864763/getRandomPuzzle', async (req, res) => {
    try {
        const puzzlesCollection = database.collection("Puzzles");
        // Get a random puzzle using aggregation framework
        const randomPuzzle = await puzzlesCollection.aggregate([
            { $sample: { size: 1 } }
        ]).toArray();

        if (randomPuzzle.length > 0) {
            res.status(200).json({
                fen: randomPuzzle[0].fen,
                solution: randomPuzzle[0].solution // Include the solution in the response
            });
        } else {
            res.status(404).json({ message: "No puzzles found." });
        }
    } catch (error) {
        console.error("Error fetching random puzzle:", error);
        res.status(500).json({ message: "An error occurred while fetching a random puzzle", error: error.message });
    }
});
// Like the post
app.post('/M00864763/likePost', async (req, res) => {
    const { postId } = req.body;
    
    //Check if logged in
    if (!req.session.user) {
        return res.status(401).json({ message: "You must be logged in to like a post." });
    }
    
    try {
        const contentCollection = database.collection("Content");
        //Increment count if possible
        const result = await contentCollection.updateOne(
            { _id: new ObjectId(postId) },
            { $inc: { likeCount: 1 } }
        );
        //Was post found and updated
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Post not found or already liked." });
        }
        res.status(200).json({ message: "Post liked successfully." });
    } catch (error) {
        res.status(500).json({ message: "An error occurred while liking the post", error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(uri);
    console.log('Server running on http://localhost:8080/M00864763/index.html');
});