import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    fullName: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Please enter valid 10 digit phone number"]
    },

    addressLine1: {
      type: String,
      required: true
    },

    addressLine2: {
      type: String
    },

    city: {
      type: String,
      required: true
    },

    state: {
      type: String,
      required: true
    },

    pinCode: {
      type: String,
      required: true,
      match: [/^\d{6}$/, "Please enter valid 6 digit pincode"]
    },

    country: {
      type: String,
      default: "India"
    },

    isDefault: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Address = mongoose.model("Address", addressSchema);

export default Address;