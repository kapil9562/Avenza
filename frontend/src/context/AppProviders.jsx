import { GoogleOAuthProvider } from '@react-oauth/google';
import { CartProvider } from './CartContext';
import { SearchProvider } from './SearchContext';
import { ProductsProvider } from './ProductsContext';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import { FavItemsProvider } from './FavItemsContext';
import { ToastProvider } from './ToastContext';
import { ModalProvider } from './ModalContext';

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <GoogleOAuthProvider clientId="500656225818-ihebsubvhf87nbn1rqvg36b88to08b1d.apps.googleusercontent.com">
            <SearchProvider>
              <ProductsProvider>
                <FavItemsProvider>
                  <CartProvider>
                    <ModalProvider>
                      {children}
                    </ModalProvider>
                  </CartProvider>
                </FavItemsProvider>
              </ProductsProvider>
            </SearchProvider>
          </GoogleOAuthProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}