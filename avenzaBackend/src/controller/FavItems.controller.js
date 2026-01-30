import { poolPromise, sql } from "../db/index.js";

const toggleFav = async (req, res) => {
    const { UserId, ProductId } = req.body;

    console.log("pid :", ProductId);
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("UserId", sql.NVarChar, UserId)
            .input("ProductId", sql.Int, ProductId)
            .execute('sp_ToggleFavorite');
        const data = result.recordset[0]
        res.status(200).json({ res:data });
    } catch (error) {
        console.log("favItemToggle error :: ", error);
        res.status(500).json({ error: error.message });
    }
}

const getFavItems = async (req, res) => {
    const { UserId } = req.query;
    console.log(UserId)

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("UserId", sql.NVarChar, UserId)
            .execute('sp_GetUserFavorites');
        const data = result.recordset
        console.log(result)
        res.status(200).json({ data });
    } catch (error) {
        console.log("favItemToggle error :: ", error);
        res.status(500).json({ error: error.message });
    }
}




export {toggleFav, getFavItems}