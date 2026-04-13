import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, ProductDetails, Signup, CartDetails, SearchResults, PageNotFound, About, Whitelist, ForgetPass, ResetPass, OrderSuccess, Orders, CheckoutPage, PaymentFailed, OrderDetail } from './pages'
import { Container, ProtectedRoute, ResponsiveLanding } from './components'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CartProvider } from './context/CartContext.jsx'
import { SearchProvider } from './context/SearchContext.jsx'
import { ProductsProvider } from './context/ProductsContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { FavItemsProvider } from './context/FavItemsContext.jsx';
import { ToastProvider } from "./context/ToastContext.jsx";
import PublicRoute from './components/common/PublicRoute.jsx';
import { ModalProvider } from './context/ModalContext.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <GoogleOAuthProvider clientId="500656225818-ihebsubvhf87nbn1rqvg36b88to08b1d.apps.googleusercontent.com">
            <SearchProvider>
              <ProductsProvider>
                <FavItemsProvider>
                  <CartProvider>
                    <ModalProvider>
                      <Routes>
                        <Route path='/' element={<ResponsiveLanding />} />
                        <Route element={<App />}>
                          <Route path='/home' element={<Container />} />
                          <Route path="/:pCategory/:category" element={<Container />} />
                          <Route path="/:slug/p/:productId" element={<ProductDetails />} />
                          <Route
                            path="/checkout/:productId"
                            element={
                              <ProtectedRoute>
                                <CheckoutPage />
                              </ProtectedRoute>
                            } />
                          <Route
                            path="/success" element={
                              <ProtectedRoute>
                                <OrderSuccess />
                              </ProtectedRoute>
                            } />
                          <Route
                            path="/cancel"
                            element={
                              <ProtectedRoute>
                                <PaymentFailed />
                              </ProtectedRoute>
                            } />
                          <Route
                            path="/my-account/my-orders"
                            element={
                              <ProtectedRoute>
                                <Orders />
                              </ProtectedRoute>
                            } />
                          <Route
                            path="/my-account/my-orders/search-results"
                            element={
                              <ProtectedRoute>
                                <Orders />
                              </ProtectedRoute>
                            } />
                          <Route
                            path="/my-account/my-orders/:id"
                            element={
                              <ProtectedRoute>
                                <OrderDetail />
                              </ProtectedRoute>
                            } />

                          <Route
                            path="/carts"
                            element={
                              <ProtectedRoute>
                                <CartDetails />
                              </ProtectedRoute>
                            }
                          />

                          <Route
                            path="/whitelist"
                            element={
                              <ProtectedRoute>
                                <Whitelist />
                              </ProtectedRoute>
                            }
                          />

                          <Route path="/about" element={<About />} />
                          <Route path="/search" element={<SearchResults />} />

                          <Route path="/login" element={
                            <PublicRoute>
                              <Login />
                            </PublicRoute>
                          } />
                          <Route path="/signup" element={
                            <PublicRoute>
                              <Signup />
                            </PublicRoute>
                          } />
                          <Route path="/forgetpassword" element={
                            <PublicRoute>
                              <ForgetPass />
                            </PublicRoute>
                          } />
                          <Route path="/reset-password/:email" element={
                            <PublicRoute>
                              <ResetPass />
                            </PublicRoute>} />
                        </Route>

                        <Route path="*" element={<PageNotFound />} />
                      </Routes>
                    </ModalProvider>
                  </CartProvider>
                </FavItemsProvider>
              </ProductsProvider>
            </SearchProvider>
          </GoogleOAuthProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  </BrowserRouter>
);

