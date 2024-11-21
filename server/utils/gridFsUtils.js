import mongoose from "mongoose";
import Grid from "gridfs-stream";

let gfsBucket;

export const connectGridFs = (connection) => {
  if (!connection) {
    throw new Error("Mongoose connection is required");
  }
  gfsBucket = new mongoose.mongo.GridFSBucket(connection.db, {
    bucketName: "uploads", // Name your bucket (default is "fs")
  });
};

export const getGfsBucket = () => {
  if (!gfsBucket) {
    throw new Error("GridFSBucket is not initialized. Call connectGridFs first.");
  }
  return gfsBucket;
};
