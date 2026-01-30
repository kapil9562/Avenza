import { poolPromise, sql } from "../db/index.js";

const addToCart = async (req, res) => {
    const { uid, product_id, price, qty } = req.body;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input("uid", sql.NVarChar, uid)
            .input("product_id", sql.Int, product_id)
            .input("price", sql.Decimal(10, 2), price)
            .input("qty", sql.Int, qty)
            .execute("sp_add_to_cart");
        res.status(200).json({ success: true, message: "Item added to cart" });
    } catch (err) {
        console.log('error :: ', err)
        res.status(500).json({ error: err.message });
    }

}


const getCart = async (req, res) => {
    const { uid } = req.query;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("uid", sql.NVarChar, uid)
            .execute("sp_get_cart")
        const cartItems = result.recordset || [];
        return res.status(200).json(cartItems);
    } catch (err) {
        console.log('error :: ', err)
        res.status(500).json({ error: err.message });
    }
}


const updateQty = async (req, res) => {
    const { uid, product_id, qtyChange } = req.body;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("uid", sql.NVarChar, uid)
            .input("product_id", sql.Int, product_id)
            .input("qtyChange", sql.Int, qtyChange)
            .execute("sp_update_cart_qty")
        const response = result.recordset || [];
        return res.status(200).json(response);
    } catch (err) {
        console.log('error :: ', err)
        res.status(500).json({ error: err.message });
    }
}

export { addToCart, getCart , updateQty}