import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Adminpage from "./pages/Adminpage";
import Signupage from "./pages/Signupage";
import Loginpage from "./pages/Loginpage";
import Homepage from "./pages/Homepage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";

import Navbar from "./components/Navbar";
import { useUserStore } from "./store/useUserStore";
import { useCartStore } from "./store/useCartStore";
import LoadingSpinner from "./components/LoadingSpinner";

import { Toaster } from "react-hot-toast";
import Profile from "./pages/Profile";
function App() {
  const {user, checkAuth, checkingAuth} = useUserStore();
  const {getCartItem} = useCartStore();
  useEffect(() =>{
    checkAuth();
  },[checkAuth])

  useEffect(() => {
    if(!user)return;
    getCartItem();
  }, [getCartItem, user]); 

  if(checkingAuth) return <LoadingSpinner />

  return (
    <>
      <div className="min-h-screen bg-white text-sky-600 relative overflow-hidden">
        <div className="relative z-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/signup" element={!user?<Signupage />:<Navigate to="/" />} />
            <Route path="/login" element={!user ? (<Loginpage />) : (<Navigate to="/" />)}/>
            <Route path="/profile" element={<Profile />}/>

            <Route path="/secretDashboard" element={user && user.role === "admin"?<Adminpage/>:<Navigate to="/login" />} />
            <Route path='/category/:category' element={<CategoryPage />}/>
            <Route path='/cart' element={user ? <CartPage /> : <Navigate to='/login' />} />
            <Route path='/purchase-success' element={user ? <PurchaseSuccessPage /> : <Navigate to='/login' />} />
            <Route path='/purchase-cancel' element={user ? <PurchaseCancelPage /> : <Navigate to='/login' />} />

          </Routes>
        </div>
        <Toaster/>
      </div>
    </>
  );
}

export default App;
