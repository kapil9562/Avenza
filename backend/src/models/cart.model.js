import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      index: true
    },
    productId: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    qty: {
      type: Number,
      required: true,
      default: 1
    }
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
