// api.js
import axios from "axios";

// export const api = axios.create({
//   baseURL: import.meta.env.VITE_BACKEND_BASE_URI
// });
export const api = axios.create({
  baseURL: 'http://localhost:8000/api'
});

export const googleAuth = (code) => api.get(`auth/google?code=${code}`);

export const signup = ({ email, password, name }) => api.post(`/auth/signup`, {
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

export const emailLogin = ({ email, password }) => api.post("/auth/emaillogin", {
  email,
  password
});

export const addCart = ({ uid, product_id, price, qty }) => api.post("/cart/add", {
  uid,
  product_id,
  price,
  qty,
});

export const getCart = ({ uid }) => api.get(`/cart/get?uid=${uid}`);

export const updateQty = ({ uid, product_id, qtyChange }) => api.post("/cart/updateqty", {
  uid,
  product_id,
  qtyChange
});


export const getProducts = ({ skip = 0, category, limit, title, productId, productIds }) => {
  const params = new URLSearchParams();

  params.append('skip', skip);       // always add skip
  if (category) params.append('category', category); // only if defined
  if (limit) params.append('limit', limit);
  if (title) params.append('search', title);
  if (productId) params.append('productId', productId);
  if (productIds) params.append('productIds', productIds);
  
  return api.get(`/products?${params.toString()}`);
};

export const getAllCategory = () => api.get('/category-list');

export const toggleFav = ({UserId, ProductId}) => api.post('favorite/toggle', {
  UserId,
  ProductId
});

export const getFavItems = ({UserId}) => api.get(`favorite/getitems?UserId=${UserId}`);

