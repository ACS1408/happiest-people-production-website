import mongoose from 'mongoose';

// Avoid multiple connections in dev (Next.js hot reload) by using global cache
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalAny = global as any;

const cache: MongooseCache = globalAny._mongooseConn || { conn: null, promise: null };
if (!globalAny._mongooseConn) {
  globalAny._mongooseConn = cache;
}

export async function connectToDatabase() {
  if (cache.conn) return cache.conn;
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;
  if (!uri) throw new Error('Missing MONGODB_URI env');
  if (!dbName) throw new Error('Missing MONGODB_DB env');

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, { dbName }).then(m => m);
  }
  cache.conn = await cache.promise;
  return cache.conn;
}
