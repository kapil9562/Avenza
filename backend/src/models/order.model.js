import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    name: String,
    image: String,
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    orderId : {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    orderItems: [orderItemSchema],

    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true
    },

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
        enum: ["processing", "packed", "shipped", "out_for_delivery", "delivered", "cancelled"],
        default: "processing"
    },

    totalAmount: {
        type: Number,
        required: true
    },

    deliveryCharge:{
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
        type: String,
        required: true
    }

}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

export default Order;