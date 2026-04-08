import Stripe from "stripe";
import Product from "../models/products.model.js";
import Order from "../models/order.model.js";
import Address from "../models/address.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const buyNow = async (req, res) => {
    try {

        const { productId, quantity, addressId } = req.body;

        const product = await Product.findOne({ _id: productId });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],

            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: product.title,
                            images: [product.thumbnail]
                        },
                        unit_amount: product.price < 100 ? (product.price + 100) * 100 : product.price * 100
                    },
                    quantity
                }
            ],

            mode: "payment",

            metadata: {
                productId,
                quantity,
                addressId
            },

            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`
        });

        res.json({
            url: session.url
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
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
            return res.json({ success: true, order: existingOrder });
        }

        const { productId, quantity, addressId } = session.metadata;

        const product = await Product.findOne({ _id: productId });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const deliveryCharge = (product.price * quantity) < 100 ? 100 : 0;

        const totalAmount = (product.price * quantity) + deliveryCharge;

        const now = new Date();
        const orderId = `OD${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${Math.floor(100000 + Math.random() * 900000)}`;

        const order = await Order.create({
            userId,
            orderId,
            orderItems: [
                {
                    product: product._id,
                    name: product.title,
                    image: product.thumbnail,
                    price: product.price,
                    deliveryCharge,
                    quantity
                }
            ],

            paymentMethod: "Stripe",
            paymentStatus: "paid",
            isPaid: true,

            totalAmount,
            shippingAddress: addressId,
            stripeSessionId: sessionId
        });


        product.stock -= Number(quantity);
        await product.save();

        const createdOrder = await Order.findOne({ userId: order?.userId, orderId: order?.orderId }).select("-stripeSessionId");

        res.json({
            success: true,
            message: "Order created successfully",
            order: createdOrder
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
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
            error: "Please provide required fields !"
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
            error: "Internal server error",
        });
    }
}

export const getAddress = async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({
            error: "invalid credentials!",
        })
    }

    try {
        const address = await Address.findOne({ userId });
        if (!address) {
            return res.status(402).json({
                error: "address not found !",
            })
        }

        res.status(200).json({
            success: true,
            address
        });

    } catch (error) {
        return res.status(500).json({
            error: "Internal server error",
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
        return res.status(400).json({ error: "userId required!" });
    }

    try {
        const filter = { userId };

        // STATUS FILTER
        if (status.length) {

            const statusFilters = status.map((s) => {

                if (s === "On the way") {
                    return { orderStatus: "processing" };
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

        const total = await Order.countDocuments(filter);

        const orders = await Order.find(filter).select("-stripeSessionId")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            orders,
            total,
            count: orders.length,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};

export const getOrderDetail = async (req, res) => {
    const { userId, orderId } = req.query;

    if (!userId || !orderId) {
        return res.status(400).json({
            error: "userId and orderId are required!"
        })
    }

    try {
        const order = await Order.findOne({
            userId,
            orderId
        }).select("-stripeSessionId");

        if (!order) {
            return res.status(404).json({
                error: "order not found!"
            });
        }

        return res.status(200).json({
            order
        });

    } catch (error) {
        res.status(500).json({
            error: "Internal server error",
        })
    }

};