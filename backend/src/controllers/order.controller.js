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
                        unit_amount: product.price * 100
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

        const existingOrder = await Order.findOne({ stripeSessionId: sessionId });

        if (existingOrder) {
            return res.json({ success: true, order: existingOrder });
        }

        const { productId, quantity, addressId } = session.metadata;

        const product = await Product.findOne({ _id: productId });

        const totalAmount = product.price * quantity;

        const order = await Order.create({
            userId,
            orderItems: [
                {
                    product: product._id,
                    name: product.title,
                    image: product.thumbnail,
                    price: product.price,
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

        res.json({
            success: true,
            message: "Order created successfully",
            order
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
        const address = await Address.create({
            userId, fullName, phone, addressLine1, addressLine2, city, state, pinCode, country
        });

        res.status(200).json({
            success: true,
            msg: "Address saved successfully.",
            address
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error
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
            error
        })
    }
}

export const getOrders = async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(402).json({
            error: "userId required !",
        })
    }

    try {
        const orders = await Order.find({ userId });
        if (!orders) {
            return res.status(402).json({
                success: false,
                msg: "No results found!"
            })
        }

        res.status(200).json({
            success: true,
            orders
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            error
        })
    }
}