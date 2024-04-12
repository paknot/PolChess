
//I included the tests in my final submision for clarity
//Methods here are exactly the same as in the real code
//They are here only not to mess up the main part of the code

// isValidEmail like in the front end
export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
//timeSince like in the front end
  export function timeSince(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + "y";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + "m";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + "d";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + "h";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + "m";
    }
    return Math.floor(seconds) + "s";
  }
//isValidPassword like in the front end
  export function isValidPassword(password) {
    return /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password);
  }

// Connect to database like in server.js
  import { MongoClient, ServerApiVersion } from 'mongodb';

  const uri = process.env.MONGODB_URI;
  
  export const client = new MongoClient(uri, {
    serverAPI: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
    }
  });
  
  export async function connectToDatabase() {
      try {
          await client.connect();
          const database = client.db("Polchess");
          const users = database.collection("Users");
          console.log("Connected to the database");
          return { database, users }; 
      } catch (error) {
          console.error("Error connecting to the database:", error);
          throw error; 
      }
  }
//isValidUsername same as in front end
export function isValidUsername(username) {
    return /^[a-zA-Z0-9]+$/.test(username);
  }
  