// api.js
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
});
export const api2 = axios.create({
  baseURL: "http://localhost:8000/api",
});

export const googleAuth = (code) => api2.get(`auth/google?code=${code}`);

export const signup = ({ email, password, name }) => api2.post(`/auth/signup`, {
  email,
  password,
  name
});

// export const sendOtp = ({email}) => api.post(`/sendotp`, {
//   email
// });

// export const verifyOtp = ({email, otp}) => api.post(`/verifyotp`, {
//   email,
//   otp
// });

export const emailLogin = ({ email, password }) => api2.post("/auth/emaillogin", {
  email,
  password
});

export const addCart = ({ uid, product_id, price, qty }) => api2.post("/cart/add", {
  uid,
  product_id,
  price,
  qty,
});

export const getCart = ({ uid }) => api2.get(`/cart/get?uid=${uid}`);

export const updateQty = ({ uid, product_id, qtyChange }) => api2.post("/cart/updateqty", {
  uid,
  product_id,
  qtyChange
});


export const getProducts = ({ skip = 0, category, limit, title, productId }) => {
  const params = new URLSearchParams();

  params.append('skip', skip);       // always add skip
  if (category) params.append('category', category); // only if defined
  if (limit) params.append('limit', limit);
  if (title) params.append('search', title);
  if (productId) params.append('productId', productId);
  
  return api2.get(`/products?${params.toString()}`);
};

export const getAllCategory = () => api2.get('/category-list');

export const toggleFav = ({UserId, ProductId}) => api2.post('favorite/toggle', {
  UserId,
  ProductId
});

export const getFavItems = ({UserId}) => api2.get(`favorite/getitems?UserId=${UserId}`);

