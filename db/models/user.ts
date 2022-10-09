import { model, models, Schema } from "mongoose";
import { UserInterface } from "../../utils/interface/user.interface";

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
  refreshToken: { type: String, default: "" },
  accessToken: { type: String, default: "" },
});

const DBUser = models.User || model("User", UserSchema);
export default DBUser;
