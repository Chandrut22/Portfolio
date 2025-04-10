import { MongoClient, ServerApiVersion } from "mongodb"

// Check if MongoDB URI is configured
if (!process.env.MONGODB_URI) {
  console.warn("MongoDB URI not configured. Using in-memory storage for development.")
}

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio"
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  // Add connection timeout
  connectTimeoutMS: 10000,
  // Add socket timeout
  socketTimeoutMS: 45000,
}

let client
let clientPromise: Promise<MongoClient>

// Create a mock MongoDB client for development if no URI is provided
class MockMongoClient {
  private mockDb: any = {
    collection: (name: string) => ({
      find: () => ({ toArray: async () => [] }),
      findOne: async () => null,
      insertOne: async (doc: any) => ({ insertedId: "mock-id" }),
      updateOne: async () => ({ modifiedCount: 1 }),
      deleteOne: async () => ({ deletedCount: 1 }),
    }),
  }

  async connect() {
    console.log("Using mock MongoDB client")
    return this
  }

  db(name: string) {
    return this.mockDb
  }
}

if (!process.env.MONGODB_URI) {
  // Use mock client if no MongoDB URI
  client = new MockMongoClient() as unknown as MongoClient
  clientPromise = Promise.resolve(client)
} else if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect().catch((err) => {
      console.error("Failed to connect to MongoDB:", err)
      // Fall back to mock client on connection failure
      client = new MockMongoClient() as unknown as MongoClient
      return client
    })
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect().catch((err) => {
    console.error("Failed to connect to MongoDB in production:", err)
    throw err // In production, we want to know if MongoDB connection fails
  })
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise
