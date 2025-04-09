// check-db.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('❌ MONGODB_URI not defined in .env file');
}

const client = new MongoClient(uri);

(async () => {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('mydatabase'); // change 'mydatabase' if needed
    const collections = await db.listCollections().toArray();

    if (collections.length === 0) {
      console.log('📭 No collections found in the database.');
    } else {
      console.log('📦 Collections in the database:');
      collections.forEach(col => console.log(`- ${col.name}`));
    }

    await client.close();
    console.log('🔌 Connection closed');
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  }
})();
