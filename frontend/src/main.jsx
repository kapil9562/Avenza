import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import { Container } from './components/index.js'
import Signup from './pages/Signup.jsx'
import CartDetails from './pages/CartDetails.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CartProvider } from './context/CartContext.jsx'
import { SearchProvider } from './context/SearchContext.jsx'
import { ProductsProvider } from './context/ProductsContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import SearchResults from './components/categories/SearchResults.jsx';
import ProtectedRoute from './utils/ProtectedRoute.jsx';
import { FavItemsProvider } from './context/FavItemsContext.jsx';
import PageNotFound from './pages/PageNotFound.jsx';
import About from './pages/About.jsx';
import Whitelist from './pages/Whitelist.jsx';
import ForgetPass from './pages/ForgetPass.jsx';
import ResetPass from './pages/ResetPass.jsx';


const GoogleAuthWrappper = () => {
  return (
    <GoogleOAuthProvider clientId="500656225818-ihebsubvhf87nbn1rqvg36b88to08b1d.apps.googleusercontent.com">
      <Signup />
    </GoogleOAuthProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <SearchProvider>
          <ProductsProvider>
            <FavItemsProvider>
              <CartProvider>

                <Routes>
                  <Route element={<App />}>
                    <Route index element={<Container />} />
                    <Route path="/:pCategory/:category/pl/:pid" element={<Container />} />
                    <Route path="/:slug/p/:productId" element={<ProductDetails />} />

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
                  </Route>

                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<GoogleAuthWrappper />} />
                  <Route path="/forgetpassword" element={<ForgetPass />} />
                  <Route path="/reset-password/:email" element={<ResetPass />} />

                  <Route path="*" element={<PageNotFound />} />
                </Routes>

              </CartProvider>
            </FavItemsProvider>
          </ProductsProvider>
        </SearchProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

