const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017/mongo';

const client = new MongoClient(url);

async function addCurrentDate(db) {
    try {
        const currentDate = new Date();
        const collection = db.collection('dates');
        const result = await collection.insertOne({ date: currentDate });
        console.log('Date inserted:', result.insertedId);
    } catch (error) {
        console.error('Error inserting date:', error);
    }
}

async function getAllDates(db) {
    try {
        const collection = db.collection('dates');
        return await collection.find().toArray();
    } catch (error) {
        console.error('Error fetching dates:', error);
        throw error;
    }
}

async function main() {
    try {
        await client.connect();
        const db = await client.db()
        await addCurrentDate(db);
        const dates = await getAllDates(db);
        console.log('Dates found:', dates);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

main().catch(console.error);
