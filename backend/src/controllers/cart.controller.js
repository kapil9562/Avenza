import Cart from "../models/cart.model.js";

// Add to Cart
const addToCart = async (req, res) => {
  const { uid, product_id, price, qty } = req.body;
  console.log("pid ::", product_id)

  try {
    // Check if item already exists
    const existing = await Cart.findOne({ uid, productId:product_id });

    if (existing) {
      existing.qty += qty;
      await existing.save();
    } else {
      await Cart.create({ uid, productId:product_id, price, qty });
    }

    res.status(200).json({ success: true, message: "Item added to cart" });
  } catch (err) {
    console.error("error :: ", err);
    res.status(500).json({ error: err.message });
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
    const item = await Cart.findOne({ uid, productId:product_id });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.qty += qtyChange;

    // Remove if qty becomes 0 or less
    if (item.qty <= 0) {
      await item.deleteOne();
      return res.status(200).json({ message: "Item removed from cart" });
    }

    await item.save();
    res.status(200).json(item);
  } catch (err) {
    console.error("error :: ", err);
    res.status(500).json({ error: err.message });
  }
};

export { addToCart, getCart, updateQty };
