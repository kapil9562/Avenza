import { createRoot } from 'react-dom/client';
import { Suspense } from 'react';
import './index.css';
import App from './App.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProviders } from './context/AppProviders.jsx';
import { Container, ProtectedRoute, ResponsiveLanding } from './components';
import PublicRoute from './components/common/PublicRoute.jsx';
import AccountDetail from './pages/AccountDetail.jsx';
import {
  Login, Signup, ProductDetails, CartDetails, SearchResults,
  About, Whitelist, Orders, OrderSuccess,
  PaymentFailed, OrderDetail, ForgetPass, ResetPass, PageNotFound, AddressPage, CheckOut
} from './pages';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppProviders>
      <Suspense fallback={<div className="h-dvh bg-white dark:bg-slate-900" />}>
        <Routes>
          <Route path='/' element={<ResponsiveLanding />} />
          <Route element={<App />}>
            <Route path='/home' element={<Container />} />
            <Route path="/:pCategory/:category" element={<Container />} />
            <Route path="/:slug/p/:productId" element={<ProductDetails />} />
            <Route path="/checkout" element={<ProtectedRoute><AddressPage /></ProtectedRoute>} />
            <Route path="/carts/checkout" element={<ProtectedRoute><AddressPage /></ProtectedRoute>} />
            <Route path="/checkout/payment-method" element={<ProtectedRoute><CheckOut /></ProtectedRoute>} />
            <Route path="/success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
            <Route path="/cancel" element={<ProtectedRoute><PaymentFailed /></ProtectedRoute>} />
            <Route path="/my-account/my-orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/my-account" element={<AccountDetail />} />
            <Route path="/my-account/my-orders/search-results" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/my-account/my-orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
            <Route path="/carts" element={<ProtectedRoute><CartDetails /></ProtectedRoute>} />
            <Route path="/whitelist" element={<ProtectedRoute><Whitelist /></ProtectedRoute>} />
            <Route path="/about" element={<About />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
            <Route path="/forgetpassword" element={<PublicRoute><ForgetPass /></PublicRoute>} />
            <Route path="/reset-password/:email" element={<PublicRoute><ResetPass /></PublicRoute>} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </AppProviders>
  </BrowserRouter>
);