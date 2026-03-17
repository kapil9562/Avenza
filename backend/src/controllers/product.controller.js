import mongoose from "mongoose";
import Product from "../models/products.model.js";

const getProducts = async (req, res) => {
    let { skip = 0, limit = 20, category, search, productId, productIds, inStock } = req.query;

    skip = parseInt(skip);
    limit = parseInt(limit);

    try {
        // Build filter
        const filter = {};

        if (category) {
            filter.category = category;
        }

        if (inStock === "true") {
            filter.stock = { $gt: 0 }
        }

        if (inStock === "false") {
            filter.stock = 0;
        }

        if (productIds) {
            const idsArray = productIds
                .split(",")
                .filter(id => mongoose.Types.ObjectId.isValid(id));

            filter._id = { $in: idsArray };
        }
        else if (productId) {
            filter._id = productId;
        }

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } },
            ];
        }

        // Total count
        const total = await Product.countDocuments(filter);

        // Get products
        const products = await Product.find(filter).sort({ productId: 1 })
            .skip(skip)
            .limit(limit)

        return res.status(200).json({
            total,
            products
        });

    } catch (err) {
        console.log("error :: ", err);
        res.status(500).json({ error: err.message });
    }
};


const getAllCategory = async (req, res) => {
    try {
        const data = await Product.aggregate([
            {
                $group: {
                    _id: "$parentCategory",
                    categories: { $addToSet: "$category" }
                }
            },
            {
                $project: {
                    _id: 0,
                    parentCategory: "$_id",
                    categories: 1
                }
            },
            {
                $sort: { parentCategory: 1 }
            }
        ]);

        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};


const productReview = async (req, res) => {
    const { productId, rating, comment, reviewerName, reviewerEmail } = req.body;

    if (!productId || !rating || !comment || !reviewerName || !reviewerEmail) {
        return res.status(400).json({ msg: "All fields are required!" });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ msg: "Rating must be between 1 and 5" });
    }

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ msg: "Product not found!" });
        }

        // Create new review
        const newReview = {
            rating,
            comment,
            reviewerName,
            reviewerEmail,
            date: new Date()
        };

        product.reviews.push(newReview);

        // 🔥 Recalculate Average Rating
        const totalRating = product.reviews.reduce((acc, item) => acc + item.rating, 0);
        product.rating = (totalRating / product.reviews.length).toFixed(1);

        await product.save();

        res.status(200).json({
            msg: "Thank you for sharing your experience ❤️",
            rating: product.rating
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export { getProducts, getAllCategory, productReview };