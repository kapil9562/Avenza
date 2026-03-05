import Stripe from "stripe";
import Product from "../models/products.model.js";
import Order from "../models/order.model.js";
import Address from "../models/address.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const buyNow = async (req, res) => {
    try {
        const { userId, productId, quantity, addressId } = req.body;

        const product = await Product.findOne({_id:productId});

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const totalAmount = product.price * quantity;

        console.log("total :", totalAmount)

        // create order in DB (pending)
        const order = await Order.create({
            userId: userId,
            orderItems: [
                {
                    product: product._id,
                    name: product.title,
                    price: product.price,
                    quantity
                }
            ],
            paymentMethod: "Stripe",
            totalAmount,
            paymentStatus: "pending",
            shippingAddress: addressId
        });

        // create stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],

            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: product.title
                        },
                        unit_amount: product.price * 100
                    },
                    quantity: quantity
                }
            ],

            mode: "payment",

            success_url: `${process.env.CLIENT_URL}/success?orderId=${order._id}`,
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