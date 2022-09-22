import { model, models, Schema } from "mongoose";
import { UserInterface } from "../../utils/user.interface";

const UserSchema = new Schema<UserInterface>({
  tweepId: {
    type: String,
    unique: true,
    required: true,
  },
  userTags: {
    type: [String],
    default: [],
  },
});

const User = models.User || model("User", UserSchema);
export default User;
