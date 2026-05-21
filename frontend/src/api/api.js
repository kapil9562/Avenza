// api.js
import axios from "axios";

const PRIMARY_BACKEND = import.meta.env.VITE_BACKEND_BASE_URI;
const SECONDARY_BACKEND = import.meta.env.VITE_BACKEND_BASE_URI2;

export const api = axios.create({
  baseURL: PRIMARY_BACKEND,
  withCredentials: true,
});

export const googleAuth = (code) => api.get(`auth/google?code=${code}`);

export const signup = ({ email, password, name }) => api.post(`/auth/signup`, {
  email,
  password,
  name
});

export const sendOtp = ({ email }) => api.post(`/auth/sendotp`, { email });

export const verifyOtp = ({ name, email, password, otp }) => api.post(`/auth/verifyotp`, {
  name,
  email,
  password,
  otp
});

export const sendResetOtp = ({ email }) => api.post('/auth/forgot-password', { email })
export const verifyResetOTP = ({ email, otp }) => api.post('/auth/verify-reset-otp', { email, otp })
export const resetPassword = ({ email, password }) => api.post('/auth/reset-password', { email, password })


export const emailLogin = ({ email, password }) => api.post("/auth/emaillogin", {
  email,
  password
});

export const refreshAccessToken = () => api.post('/auth/refresh');

export const getCurrentUser = () => api.get('/auth/get-current-user');

export const logoutUser = () => api.post('/auth/logout');

export const addCart = ({ uid, product_id, price, qty }) => api.post("/cart/add", {
  uid,
  product_id,
  qty,
});

export const getCart = ({ uid }) => api.get(`/cart/get?uid=${uid}`);

export const updateQty = ({ uid, product_id, qtyChange }) => api.post("/cart/updateqty", {
  uid,
  product_id,
  qtyChange
});

export const clearCart = ({ uid }) => api.post("/cart/clearall", { uid });

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

export const toggleFav = ({ UserId, ProductId }) => api.post('favorite/toggle', {
  UserId,
  ProductId
});

export const clearFav = ({ uid }) => api.post('favorite/clearall', {
  uid
});

export const getFavItems = ({ UserId }) => api.get(`favorite/getitems?UserId=${UserId}`);

export const productReview = ({ productId, rating, comment, reviewerName, reviewerEmail }) => api.post("/post-review", {
  productId,
  rating,
  comment,
  reviewerName,
  reviewerEmail
});

export const saveAddress = ({ userId, fullName, phone, addressLine1, addressLine2, city, state, pinCode, country }) => api.post("/save-address", {
  userId, fullName, phone, addressLine1, addressLine2, city, state, pinCode, country
});

export const getAddress = ({ userId }) => api.get(`/get-address?userId=${userId}`);

export const buyNow = ({ productId, quantity, addressId }) => api.post("buy-now", { productId, quantity, addressId });

export const buyCartItems = ({ items, addressId }) => api.post("/checkout/cart", { items, addressId });

export const verifyPayment = ({ sessionId, userId }) => api.post("verify-payment", { sessionId, userId });

export const getOrders = ({ userId, time = [], status = [], skip = 0 }) => {
  const statusParam = encodeURIComponent(status.join(","));
  const timeParam = encodeURIComponent(time.join(","));
  return api.get(`/get-orders?userId=${userId}&time=${timeParam}&status=${statusParam}&skip=${skip}`);
};

export const getOrderDetail = ({ userId, orderId }) => api.get(`/get-order-detail?userId=${userId}&orderId=${orderId}`);

export const deleteReview = ({ userId, productId }) => api.post("/delete-otp", userId, productId);




let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, response = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(response);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // =========================
    // BACKEND FAILOVER
    // =========================
    const shouldFallback =
      !originalRequest._fallbackTried &&
      (
        !error.response || // network error
        error.code === "ECONNABORTED" || // timeout
        error.response?.status === 502 ||
        error.response?.status === 503 ||
        error.response?.status === 504
      );

    if (shouldFallback) {
      originalRequest._fallbackTried = true;

      const currentBase =
        originalRequest.baseURL || api.defaults.baseURL;

      const newBase =
        currentBase === PRIMARY_BACKEND
          ? SECONDARY_BACKEND
          : PRIMARY_BACKEND;

      console.log("Switching backend:", newBase);

      // switch current request
      originalRequest.baseURL = newBase;

      // switch future requests
      api.defaults.baseURL = newBase;

      try {
        return await api(originalRequest);
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }

    // =========================
    // TOKEN REFRESH
    // =========================
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      isRefreshing = true;

      try {
        await refreshAccessToken();
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);