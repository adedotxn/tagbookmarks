import { model, models, Schema } from "mongoose";

const CollectionSchema = new Schema({
  tweetId: {
    type: String,
    unique: true,
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
