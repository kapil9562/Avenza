import mongoose from "mongoose";
import Address from "./address.model.js";

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
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
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true,
        default: "India"
    },
    pinCode: {
        type: String,
        required: true
    }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    orderId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    orderItems: {
        type: [orderItemSchema],
        required: true,
    },

    shippingAddress: shippingAddressSchema,

    paymentMethod: {
        type: String,
        enum: ["COD", "Stripe", "Razorpay", "PayPal"],
        required: true
    },

    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },

    orderStatus: {
        type: String,
        enum: ["processing", "shipped", "out_for_delivery", "delivered", "cancelled"],
        default: "processing"
    },

    totalAmount: {
        type: Number,
        required: true
    },

    deliveryCharge: {
        type: Number,
        default: 0
    },

    taxAmount: {
        type: Number,
        default: 0
    },

    shippingAmount: {
        type: Number,
        default: 0
    },

    isPaid: {
        type: Boolean,
        default: false
    },

    paidAt: Date,

    paymentId: String,

    stripeSessionId: {
        type: String
    }

}, { timestamps: true });

orderSchema.index({ orderStatus: 1, paymentMethod: 1, createdAt: -1 });

orderSchema.pre("save", async function () {

    if (!this.isNew) return;

    const selectedAddress = await Address.findOne({
        userId: this.user
    });

    if (!selectedAddress) {
        throw new Error("Address not found");
    }

    this.shippingAddress = {
        fullName: selectedAddress.fullName,
        phone: selectedAddress.phone,
        addressLine1: selectedAddress.addressLine1,
        addressLine2: selectedAddress.addressLine2,
        city: selectedAddress.city,
        state: selectedAddress.state,
        country: selectedAddress.country,
        pinCode: selectedAddress.pinCode,
    };
});

const Order = mongoose.model("Order", orderSchema);

export default Order;