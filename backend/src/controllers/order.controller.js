import Stripe from "stripe";
import Product from "../models/products.model.js";
import Order from "../models/order.model.js";
import Address from "../models/address.model.js";
import Cart from "../models/cart.model.js";
import User from "../models/user.model.js"
import mongoose from "mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const VALID_METHODS = ["cod", "upi", "card"];

export const buyNow = async (req, res) => {
    const { order, addressId, paymentMethod, userId } = req.body;

    if (!paymentMethod) {
        return res.status(400).json({
            success: false,
            message: "Payment method is required!"
        });
    }

    if (!VALID_METHODS.includes(paymentMethod)) {
        return res.status(400).json({
            success: false,
            message: "Invalid payment method!"
        });
    }

    if (!order || !Array.isArray(order) || order.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Order items are required!"
        });
    }

    try {

        if (paymentMethod === "cod") {

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: "userId is required!"
                });
            }

            const now = new Date();
            const orderId = `OD${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${Math.floor(100000 + Math.random() * 900000)}`;

            const productIds = order.map(item => item.productId);

            const products = await Product.find({
                _id: { $in: productIds }
            });

            let subtotal = 0;

            const orderItems = order.map((item) => {

                const product = products.find(
                    p => p._id.toString() === item.productId
                );

                if (!product) {
                    throw new Error("Product not found");
                }

                if (product.stock < item.quantity) {
                    return res.status(400).json({
                        success: false,
                        message: `${product.title} has insufficient stock`
                    });
                }

                subtotal += product.price * item.quantity;

                return {
                    product: product._id,
                    name: product.title,
                    image: product.thumbnail,
                    price: product.price,
                    quantity: item.quantity
                }
            });

            const deliveryCharge = subtotal < 500 ? 100 : 0;
            const totalAmount = subtotal + deliveryCharge;

            const createdOrder = await Order.create({
                user: userId,
                orderId,
                orderItems,
                paymentMethod: "COD",
                paymentStatus: "pending",
                isPaid: false,
                deliveryCharge,
                totalAmount
            });

            return res.json({
                success: true,
                message: "Order created successfully",
                orderId: createdOrder?._id
            });

        }

        const productIds = order.map(item => item.productId);

        const products = await Product.find({
            _id: { $in: productIds }
        });

        if (products.length !== productIds.length) {
            return res.status(404).json({
                success: false,
                message: "Some products not found"
            });
        }

        let subtotal = 0;

        for (const item of order) {
            const product = products.find(
                p => p._id.toString() === item.productId
            );

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `${product.title} has insufficient stock`
                });
            }

            subtotal += product.price * item.quantity;
        }

        const line_items = order.map(item => {
            const product = products.find(
                p => p._id.toString() === item.productId
            );

            return {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: product.title,
                        images: product.thumbnail
                            ? [product.thumbnail]
                            : []
                    },
                    unit_amount: product.price * 100
                },
                quantity: item.quantity
            };
        });

        const deliveryCharge = subtotal < 100 ? 100 : 0;

        if (deliveryCharge > 0) {
            line_items.push({
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: "Delivery Charge"
                    },
                    unit_amount: deliveryCharge * 100
                },
                quantity: 1
            });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: [paymentMethod],
            line_items,
            mode: "payment",
            metadata: {
                addressId,
                productIds: JSON.stringify(productIds),
                items: JSON.stringify(
                    order.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity
                    }))
                )
            },
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`
        });

        return res.status(200).json({
            success: true,
            url: session.url
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { sessionId, userId } = req.body;

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== "paid") {
            return res.json({
                success: false,
                message: "Payment not completed"
            });
        }

        const existingOrder = await Order.findOne({ stripeSessionId: sessionId }).select("-stripeSessionId");

        if (existingOrder) {
            return res.json({
                success: true,
                orderId: existingOrder._id
            });
        }

        const now = new Date();
        const orderId = `OD${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${Math.floor(100000 + Math.random() * 900000)}`;


        const items = JSON.parse(session.metadata.items);

        const paymentMethod = session.payment_method_types[0];

        let orderItems = [];
        let subtotal = 0;

        for (const item of items) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }



            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `${product.title} stock is insufficient`
                });
            }

            subtotal += product.price * item.quantity;

            orderItems.push({
                product: product._id,
                name: product.title,
                image: product.thumbnail,
                price: product.price,
                quantity: item.quantity
            });

            product.stock -= Number(item.quantity);

            await product.save();
        }

        const deliveryCharge = subtotal < 500 ? 100 : 0;
        const totalAmount = subtotal + deliveryCharge;

        const order = await Order.create({
            user: userId,
            orderId,
            orderItems,
            paymentMethod: paymentMethod,
            paymentStatus: "paid",
            isPaid: true,
            totalAmount,
            deliveryCharge,
            stripeSessionId: sessionId
        });

        const user = await User.findById({ _id: userId })

        await Cart.deleteMany({ uid: user.uid });

        return res.json({
            success: true,
            message: "Order created successfully",
            orderId: order?._id
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to verify payment"
        });
    }
};

export const saveAddress = async (req, res) => {
    const { userId, fullName, phone, addressLine1, addressLine2, city, state, pinCode, country } = req.body;

    if (!userId || !fullName || !phone || !addressLine1 || !city || !state || !pinCode || !country) {
        return res.status(400).json({
            success: false,
            message: "Please provide required fields !"
        })
    }

    try {
        const existingAddress = await Address.findOne({ userId });
        let address = {};
        if (!existingAddress) {
            address = await Address.create({
                userId, fullName, phone, addressLine1, addressLine2, city, state, pinCode, country
            });
        } else {
            address = await Address.findOneAndUpdate(
                { userId },
                {
                    fullName,
                    phone,
                    addressLine1,
                    addressLine2,
                    city,
                    state,
                    pinCode,
                    country
                },
                { returnDocument: "after" }
            )
        }
        res.status(200).json({
            success: true,
            msg: "Address saved successfully.",
            address
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const getAddress = async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({
            message: "invalid credentials!",
        })
    }

    try {
        const address = await Address.findOne({ userId });
        if (!address) {
            return res.status(404).json({
                message: "address not found !",
            })
        }

        res.status(200).json({
            success: true,
            address
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
        })
    }
}

export const getOrders = async (req, res) => {
    const { userId } = req.query;

    const status = req.query.status ? req.query.status.split(",") : [];
    const time = req.query.time ? req.query.time.split(",") : [];

    const limit = parseInt(req.query.limit) || 5;
    const skip = parseInt(req.query.skip) || 0;

    if (!userId) {
        return res.status(400).json({ message: "userId required!" });
    }

    try {
        const filter = { user: userId };

        // STATUS FILTER
        if (status.length) {

            const statusFilters = status.map((s) => {

                if (s === "onetheway") {
                    return {
                        orderStatus: {
                            $in: ["processing", "shipped", "out_for_delivery"]
                        }
                    };
                }

                return { orderStatus: s.toLowerCase() };

            });

            filter.$or = statusFilters;
        }

        // TIME FILTER
        if (time.length) {

            const timeFilters = [];

            time.forEach((t) => {

                if (t === "Last 30 days") {

                    const date = new Date();
                    date.setDate(date.getDate() - 30);

                    timeFilters.push({ createdAt: { $gte: date } });

                }

                else if (t === "2024") {

                    timeFilters.push({
                        createdAt: {
                            $gte: new Date("2024-01-01"),
                            $lte: new Date("2024-12-31"),
                        },
                    });

                }

                else if (t === "2023") {

                    timeFilters.push({
                        createdAt: {
                            $gte: new Date("2023-01-01"),
                            $lte: new Date("2023-12-31"),
                        },
                    });

                }

                else if (t === "Older") {

                    timeFilters.push({
                        createdAt: { $lt: new Date("2023-01-01") },
                    });

                }

            });

            if (timeFilters.length) {

                if (filter.$or) {
                    filter.$and = [
                        { $or: filter.$or },
                        { $or: timeFilters }
                    ];
                    delete filter.$or;
                } else {
                    filter.$or = timeFilters;
                }

            }

        }

        const [stats] = await Order.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },

                    completed: {
                        $sum: {
                            $cond: [{ $eq: ["$orderStatus", "delivered"] }, 1, 0]
                        }
                    },

                    pending: {
                        $sum: {
                            $cond: [{ $ne: ["$orderStatus", "delivered"] }, 1, 0]
                        }
                    }
                }
            }
        ]);

        const total = stats?.total || 0;
        const completed = stats?.completed || 0;
        const pending = stats?.pending || 0;

        const orders = await Order.find(filter).select("-stripeSessionId")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            orders,
            total,
            completed,
            pending,
            count: orders.length,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getOrderDetail = async (req, res) => {
    const { userId, orderId } = req.query;

    if (!userId || !orderId) {
        return res.status(400).json({
            message: "userId and orderId are required!"
        })
    }

    try {
        const order = await Order.findOne({
            user: userId,
            orderId
        }).select("-stripeSessionId");

        if (!order) {
            return res.status(404).json({
                message: "order not found!"
            });
        }

        return res.status(200).json({
            order
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
        })
    }

};