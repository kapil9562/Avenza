import Product from "../models/products.model.js";

const getProducts = async (req, res) => {
    let { skip = 0, limit = 30, category, search, productId } = req.query;

    skip = parseInt(skip);
    limit = parseInt(limit);

    try {
        // Build filter
        const filter = {};

        if (category) {
            filter.category = category;
        }

        if (productId) {
            filter._id = productId;
        }

        if (search) {
            filter.title = { $regex: search, $options: "i" };
        }

        // Total count
        const total = await Product.countDocuments(filter);

        // Get products
        const products = await Product.find(filter)
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

export { getProducts, getAllCategory };