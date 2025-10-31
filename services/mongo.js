const mongoose = require('mongoose');

let isConnected = false;

async function mongoConnect() {
    if (isConnected) return mongoose.connection;

    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/distributors_db';

    mongoose.set('strictQuery', true);

    await mongoose.connect(mongoUri, {
        dbName: process.env.MONGODB_DB || undefined
    });

    isConnected = true;
    console.log('MongoDB connected');
    return mongoose.connection;
}

module.exports = { mongoConnect };


