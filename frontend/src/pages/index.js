import { lazy } from 'react';

export const Login = lazy(() => import('./Login'));
export const Signup = lazy(() => import('./Signup'));
export const ProductDetails = lazy(() => import('./ProductDetails'));
export const CartDetails = lazy(() => import('./CartDetails'));
export const SearchResults = lazy(() => import('./SearchResults'));
export const About = lazy(() => import('./About'));
export const Whitelist = lazy(() => import('./Whitelist'));
export const Orders = lazy(() => import('./Orders'));
export const CheckoutPage = lazy(() => import('./CheckoutPage'));
export const OrderSuccess = lazy(() => import('./OrderSuccess'));
export const PaymentFailed = lazy(() => import('./PaymentFailed'));
export const OrderDetail = lazy(() => import('./OrderDetail'));
export const ForgetPass = lazy(() => import('./ForgetPass'));
export const ResetPass = lazy(() => import('./ResetPass'));
export const PageNotFound = lazy(() => import('./PageNotFound'));
export const FavItems = lazy(() => import('./FavItems'));