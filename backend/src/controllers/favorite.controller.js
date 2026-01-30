import Favorite from "../models/favorite.model.js";

const toggleFav = async (req, res) => {
    const { UserId, ProductId } = req.body;

    try {
        const uid = UserId;
        const productId = Number(ProductId);

        const existing = await Favorite.findOne({ uid, productId });

        if (existing) {
            await Favorite.deleteOne({ uid, productId });
            return res.status(200).json({ res: "Removed from favorites" });
        } else {
            const count = await Favorite.countDocuments({ uid });

            if (count == 10) {
                return res.status(400).json({
                    res: "LIMIT REACHED !"
                });
            }
            await Favorite.create({ uid, productId });
            return res.status(200).json({ res: "Added to favorites" });
        }
    } catch (error) {
        console.log("toggleFav error :: ", error);
        res.status(500).json({ error: error.message });
    }
};

const getFavItems = async (req, res) => {
    const { UserId } = req.query;

    try {
        const favorites = await Favorite.find({ uid: UserId }).lean();

        res.status(200).json({ data: favorites });
    } catch (error) {
        console.log("getFavItems error :: ", error);
        res.status(500).json({ error: error.message });
    }
};


export { toggleFav, getFavItems }