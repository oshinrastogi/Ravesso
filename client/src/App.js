import { Routes,Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Contact from "./pages/Contact";
import Policy from "./pages/Policy";
import About from "./pages/About";
import Pagenotfound from "./pages/Pagenotfound";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from "./pages/user/Dashboard";
import PrivateRoute from "./components/Routes/Private";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import AdminRoute from "./components/Routes/AdminRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateCategory from "./pages/Admin/CreateCategory";
import CreateProduct from "./pages/Admin/CreateProduct";
import Users from "./pages/Admin/Users";
import Orders from "./pages/user/Orders";
import Profile from "./pages/user/Profile";
import Products from "./pages/Admin/Products";
import UpdateProduct from "./pages/Admin/UpdateProduct";
import Search from "./pages/Search";
import ProductDetail from "./pages/ProductDetail";
import Categories from "./pages/Categories";
import CategoryProduct from "./pages/CategoryProduct";
import CartPage from "./pages/CartPage";
import AdminOrders from "./pages/Admin/AdminOrders";
import { validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils.js';


function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/search" element={<Search/>} />
      <Route path="/categories" element={<Categories/>} />
      <Route path="/cart" element={<CartPage/>} />
      <Route path="/category/:slug" element={<CategoryProduct/>} />
      <Route path="/product/:slug" element={<ProductDetail/>} />
      <Route path="/dashboard" element={<PrivateRoute/>}>

      <Route path="user" element={<Dashboard/>} />
      <Route path="user/orders" element={<Orders/>} />
      <Route path="user/profile" element={<Profile/>} />
      </Route>

      <Route path="/dashboard" element={<AdminRoute/>}>
      <Route path="admin" element={<AdminDashboard/>} />
      <Route path="admin/create-category" element={<CreateCategory/>} />
      <Route path="admin/create-product" element={<CreateProduct/>} />
      <Route path="admin/update-product/:slug" element={<UpdateProduct/>} />
      <Route path="admin/users" element={<Users/>} />
      <Route path="admin/products" element={<Products/>} />
      <Route path="admin/orders" element={<AdminOrders/>} />
      </Route>

      <Route path="/register" element={<Register/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/forgot-password" element={<ForgotPassword/>} />
      <Route path="/about" element={<About/>} />
      <Route path="/policy" element={<Policy/>} />
      <Route path="/contact" element={<Contact/>} />
      <Route path="/*" element={<Pagenotfound/>} />
    </Routes>
    </>
  );
}

export default App;
