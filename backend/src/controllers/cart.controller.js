import Cart from "../models/cart.model.js";

// Add to Cart
const addToCart = async (req, res) => {
  const { uid, product_id, price, qty } = req.body;

  try {
    const existing = await Cart.findOne({ uid, productId: product_id });

    if (existing) {
      const newQty = existing.qty + qty;

      if (newQty > 5) {
        return res.status(409).json({
          success: false,
          error: "Quantity limit exceeded!"
        });
      }

      existing.qty = newQty;
      await existing.save();

      return res.status(200).json({
        success: true,
        message: "Item quantity updated in cart."
      });
    }

    const totalCart = await Cart.countDocuments({ uid });

    if (totalCart >= 10) {
      return res.status(409).json({
        success: false,
        error: "Cart limit exceeded!"
      });
    }

    await Cart.create({
      uid,
      productId: product_id,
      price,
      qty
    });

    return res.status(201).json({
      success: true,
      message: "Item added to cart"
    });
  } catch (err) {
    console.error("error :: ", err);
    return res.status(500).json({ error: err.message });
  }
};

// Get Cart
const getCart = async (req, res) => {
  const { uid } = req.query;

  try {
    const cartItems = await Cart.find({ uid });
    res.status(200).json(cartItems);
  } catch (err) {
    console.error("error :: ", err);
    res.status(500).json({ error: err.message });
  }
};

// Update Quantity
const updateQty = async (req, res) => {
  const { uid, product_id, qtyChange } = req.body;

  try {
    const item = await Cart.findOne({ uid, productId: product_id });

    if (!item) {
      return res.status(404).json({
        success: false,
        error: "Item not found"
      });
    }

    const newQty = item.qty + qtyChange;

    if (newQty > 5) {
      return res.status(409).json({
        success: false,
        error: "limit exceeded!"
      });
    }

    if (newQty <= 0) {
      await item.deleteOne();
      return res.status(200).json({
        success: true,
        message: "Item removed from cart"
      });
    }

    item.qty = newQty;
    await item.save();

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      item
    });
  } catch (err) {
    console.error("error :: ", err);
    return res.status(500).json({ error: err.message });
  }
};

const clearCart = async (req, res) => {
  const { uid } = req.body;
  try {
    await Cart.deleteMany({ uid })
    return res.status(200).json({ message: "Cart cleared successfully" });
  } catch (err) {
    console.error("error :: ", err);
    res.status(500).json({ error: err.message });
  }
}

export { addToCart, getCart, updateQty, clearCart };
