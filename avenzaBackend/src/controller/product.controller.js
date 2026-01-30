import { poolPromise, sql } from "../db/index.js";

const getProducts = async (req, res) => {

    const { skip, category, limit, search, productId } = req.query;

    console.log(category);
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("skip", sql.Int, skip)
            .input("category", sql.NVarChar, category)
            .input("limit", sql.Int, limit)
            .input("search", sql.NVarChar, search)
            .input("productId", sql.Int, productId)
            .execute("sp_GetProducts");

        const total = result.recordsets[0][0].Total;
        const products = result.recordsets[1].map(row => ({
            ...row,
            tags: JSON.parse(row.tags),
            dimensions: JSON.parse(row.dimensions),
            reviews: JSON.parse(row.reviews),
            images: JSON.parse(row.images),
            meta: JSON.parse(row.meta)
        })) || [];

        return res.status(200).json({
            total,
            products
        });
    } catch (err) {
        console.log('error :: ', err)
        res.status(500).json({ error: err.message });
    }
}

const getAllCategory = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .execute('sp_GetAllCategories');
        const jsonKey = Object.keys(result.recordset[0])[0];
        const data = JSON.parse(result.recordset[0][jsonKey]).map(item => ({
            parentCategory: item.parentCategory,
            categories: item.categories.map(c => c.category)
        }));
        return res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error })
        console.log(error)
    }
}

export { getProducts, getAllCategory }