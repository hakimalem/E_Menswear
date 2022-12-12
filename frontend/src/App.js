import { Route, Routes, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Cart from './pages/Cart';
import ProductsList from './pages/ProductsList';
import Shipping from './pages/Shipping';
import Signing from './pages/Signing';
import SingleProduct from './pages/SingleProduct';
import 'react-toastify/dist/ReactToastify.css';
import { useContext, useEffect } from 'react';
import { Store } from './Store';
import Signup from './pages/Signup';
import Payment from './pages/Payment';
import PlaceOrder from './pages/PlaceOrder';
import Order from './pages/Order';
import OrderHistory from './pages/OrderHistory';
import Profile from './pages/Profile';

function App() {
  return (
    <div className="px-0 md:px-10 min-h-screen">
      <ToastContainer position="bottom-right" limit={1} />
      <Routes>
        <Route path="/products/slug/:slug" element={<SingleProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/signin" element={<Signing />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/placeorder" element={<PlaceOrder />} />
        <Route path="/order/:id" element={<Order />} />
        <Route path="/orderhistory" element={<OrderHistory />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/" element={<ProductsList />} />
      </Routes>
    </div>
  );
}

export default App;
