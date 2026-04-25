import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUri = process.env.MONGODB_URI;

let connection;

async function connectDB() {
    try {
        // Connect to MongoDB replica set
        connection = await mongoose.connect(mongoUri);

        console.log(`Connected to MongoDB replica set: ${connection.connection.host}`);
        console.log(`Database: ${connection.connection.name}`);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected');
        });

    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        process.exit(1);
    }
}

export { connectDB, connection };

