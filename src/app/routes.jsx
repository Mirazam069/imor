import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

// Pages
import Home from "../pages/Home/Home";
import Catalog from "../pages/Catalog/Catalog";
import PostAd from "../pages/PostAd/PostAd";
import Login from "../pages/Login/Login";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Cart from "../pages/Cart/Cart";

// ✅ Seller pages
import SellerProducts from "../pages/seller/SellerProducts/SellerProducts";
import SellerProfile from "../pages/seller/SellerProfile";

// ✅ Auth
import Register from "../pages/Auth/Register";

// NotFound
import NotFound from "../pages/NotFound/NotFound";
import AddProduct from "../pages/seller/AddProducts/AddProduct";
import EditProduct from "../pages/seller/EditProduct/EditProduct";
import AboutProject from "../pages/Home/AboutProject";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },

      // ✅ children ichida relative yozamiz
      { path: "catalog", element: <Catalog /> },
      { path: "post-ad", element: <PostAd /> },
      { path: "login", element: <Login /> },

      // ✅ Auth
      { path: "register", element: <Register /> }, // ✅ FIX

      // ✅ product + cart
      { path: "product/:id", element: <ProductDetails /> },
      { path: "cart", element: <Cart /> },

      // ✅ Seller routes
      { path: "seller/products", element: <SellerProducts /> },
      { path: "seller/:sellerId", element: <SellerProfile /> },

      { path: "seller/add-product", element: <AddProduct /> },
      { path: "seller/edit-product/:id", element: <EditProduct /> },
      {
        path: "/about",
        element: <AboutProject />,
      },

      // 404 (eng oxirida tursin)
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
