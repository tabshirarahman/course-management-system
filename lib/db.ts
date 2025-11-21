import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var _mongoose:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://coursemanagement:CIgOxcTZvumO0b8O@cluster0.lefbign.mongodb.net/?appName=Cluster0";
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing in environment variables");
}

export async function dbConnect() {
  // initialize global cache container
  if (!global._mongoose) {
    global._mongoose = { conn: null, promise: null };
  }

  // if connected, return existing connection
  if (global._mongoose.conn) {
    return global._mongoose.conn;
  }

  // if promise doesn't exist, create new connection
  if (!global._mongoose.promise) {
    global._mongoose.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((m) => m);
  }

  try {
    global._mongoose.conn = await global._mongoose.promise;
  } catch (error) {
    global._mongoose.promise = null;
    throw error;
  }

  return global._mongoose.conn;
}

export default dbConnect;
