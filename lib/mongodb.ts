import { MongoClient } from 'mongodb';

// Ensure MONGODB_URI is a string or undefined
const uri: string | undefined = process.env.MONGODB_URI;
const options = {};

// Declare types for client and clientPromise
let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient>;

// Throw an error if MONGODB_URI is missing
if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

// Declare a global interface to manage the MongoClient promise in development
declare global {
  // Augment the global NodeJS interface
  var _mongoClientPromise: Promise<MongoClient> | undefined; //eslint-disable-line no-var
}

// Check if we're in development mode
if (process.env.NODE_ENV === 'development') {
  // Use a global variable to preserve the MongoClient promise during HMR (Hot Module Replacement)
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new MongoClient instance on every request
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export the MongoClient promise to share across your app
export default clientPromise;
