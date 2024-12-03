import mongoose from "mongoose";

let gfsBucket;

export const connectGridFs = (connection) => {
  if (!connection) {
    throw new Error("Mongoose connection is required");
  }
  gfsBucket = new mongoose.mongo.GridFSBucket(connection.db, {
    bucketName: "uploads",
  });
};

export const getGfsBucket = () => {
  if (!gfsBucket) {
    throw new Error("GridFSBucket is not initialized. Call connectGridFs first.");
  }
  return gfsBucket;
};
