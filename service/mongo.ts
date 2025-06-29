// import mongoose from 'mongoose'

// export async function dbConnect(){

//     try {
//         return await mongoose.connect(String(process.env.MONGODB_CONNECTION_STRING))
      
        
//     } catch (error) {
//         console.log(error)
//     }
  
// }
// lib/dbConnect.ts
// import mongoose from 'mongoose';

// export async function dbConnect() {
//   // Check if already connected
//   if (mongoose.connection.readyState >= 1) {
//     console.log('Already connected to MongoDB');
//     return mongoose.connection;
//   }

//   try {
//     const connection = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string, {
//       // Remove deprecated options
//     });
//     console.log('Connected to MongoDB');
//     return connection;
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     throw new Error('Failed to connect to MongoDB');
//   }
// }

// lib/dbConnect.ts

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_CONNECTION_STRING!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_CONNECTION_STRING environment variable');
}

// Create a global cache if it doesn’t exist
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  try {
    cached.conn = await cached.promise;
    console.log('✅ Connected to MongoDB');
    return cached.conn;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    throw err;
  }
}
