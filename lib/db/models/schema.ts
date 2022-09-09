import { model, models, Schema } from "mongoose";

const UserSchema = new Schema({
  username: { type: String, lowercase: true, unique: true, trim: true },
  bio: { type: String },
  socials: {
    instagram: { type: String },
    twitter: { type: String },
    github: { type: String },
  },
});

const User = models.User || model("User", UserSchema);
export default User;
