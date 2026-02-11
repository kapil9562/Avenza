import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      index: true
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    }
  },
  { timestamps: true }
);

favoriteSchema.index({ uid: 1, productId: 1 }, { unique: true });

export default mongoose.model("Favorite", favoriteSchema);
