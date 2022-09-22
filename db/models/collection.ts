import { model, models, Schema } from "mongoose";
import { CollectionInterface } from "../../utils/collection.interface";

const CollectionSchema = new Schema<CollectionInterface>({
  tweepId: {
    type: String,
    ref: "User",
    unique: true,
    required: true,
  },
  tweetId: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  time: { type: String, default: Date.now() },
});

const Collection = models.Collection || model("Collection", CollectionSchema);
export default Collection;
