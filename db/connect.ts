import mongoose from "mongoose";
// const connect = () => {
//     mongoose.connect(
//         process.env.MONGODB_URI!,
//         (err) => {
//             if(err) console.log("Error connecting to DB", err);
//             else console.log("Connected to DB")
//         }
//     )
// }

// export default connect;

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Error finding mongoDB URI");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connect;
