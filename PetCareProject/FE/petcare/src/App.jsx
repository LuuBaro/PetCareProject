import "./App.css";
import Cart from "./components/cart/Cart";
import OrderManagementPage from "./components/order/OrderManagementPage";
import { OrderProvider } from "./components/order/OrderContext";
import { ComingSoon } from "./components/other/ComingSoon";
import Products from "./components/products/Products";
import HomePage from "./pages/HomePage";
import ManageProduct from "./components/Manage/ManageProduct";
import ProductDetail from "./components/productdetail/ProductDetail";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ManageUser from "./components/Manage/ManageUser";
import Admin from "./pages/Admin";
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import ProtectedRoute from "./service/ProtectedRoute";
import Checkout from "./components/pay/Checkout";
import AddressForm from "./components/pay/AddressForm";
import User from "./components/user/User";
import PayOrder from "./components/user/PayOrder";
import OrderPage from "./components/Manage/OrderPage";
function App() {
  const userRole = localStorage.getItem("userRole");
  const currentPath = window.location.pathname;
  console.log(userRole);
  if (currentPath === "/admin") {
    if (userRole === "Admin") {
      return <Admin />;
    } else if (userRole === "Người dùng") {
      return window.location.replace("/");
    } else {
      return window.location.replace("/login");
    }
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/comingsoon" element={<ComingSoon />} />
        <Route path="/products" element={<Products />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/address" element={<AddressForm />} />
        <Route path="/user" element={<User />} />
        <Route path="/payorder" element={<PayOrder />} />
        <Route path="/orderpage" element={<OrderPage />} />

     
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        
        <Route path="/product/:id" element={<ProductDetail />} /> {/* Ensure this route matches */}
        <Route
          path="/manageproduct"
          element={
            <ProtectedRoute>
              <ManageProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manageuser"
          element={
            <ProtectedRoute>
              <ManageUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderProvider>
                <OrderManagementPage />
              </OrderProvider>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
