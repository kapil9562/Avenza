import mongoose from "mongoose";
import Address from "./address.model.js";

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

    orderId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    orderItems: [orderItemSchema],

    shippingAddress: {
        addressId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address",
            required: true
        },

        address: String
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
        type: String,
        required: true
    }

}, { timestamps: true });

orderSchema.pre("save", async function (next) {

    if (!this.isNew) return next();

    const selectedAddress = await Address.findById(
        this.shippingAddress.addressId
    );

    if (!selectedAddress) {
        return next(new Error("Address not found"));
    }

    this.shippingAddress.fullName = selectedAddress.fullName;

    this.shippingAddress.phone = selectedAddress.phone;

    this.shippingAddress.address =
        `${selectedAddress.addressLine1}, ` +
        `${selectedAddress.addressLine2 || ""}, ` +
        `${selectedAddress.city}, ` +
        `${selectedAddress.state} - ${selectedAddress.pinCode}, ` +
        `${selectedAddress.country}`;

    next();
});

const Order = mongoose.model("Order", orderSchema);

export default Order;