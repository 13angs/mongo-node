// const { MongoClient } = require('mongodb');
import { MongoClient } from 'mongodb';
import 'dotenv/config';

// Connection URL and options
const url = process.env.DATABASE_URL; // Change this URL to match your MongoDB server

async function dropAllDatabases() {
    const client = new MongoClient(url);

    try {
        // Connect to the MongoDB server
        await client.connect();

        // List all databases
        const adminDb = client.db('admin');
        const databases = await adminDb.admin().listDatabases();

        // Drop all user-created databases (exclude admin and local)
        for (const db of databases.databases) {
            if (db.name !== 'admin' && db.name !== 'config' && db.name !== 'local') {
                await client.db(db.name).dropDatabase();
                console.log(`Dropped database: ${db.name}`);
            }
        }
    } finally {
        // Close the client connection
        await client.close();
    }
}

// Call the function to drop all databases
dropAllDatabases()
    .then(() => {
        console.log('All databases dropped successfully.');
    })
    .catch((err) => {
        console.error('Error dropping databases:', err);
    });
