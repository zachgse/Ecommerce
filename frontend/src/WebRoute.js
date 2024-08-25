import { Route,Routes } from "react-router-dom"
import Home from './pages/Home'
import Login from "./pages/Login"
import Register from "./pages/Register"
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Search from "./pages/Search";

import ProfileIndex from "./pages/User/Profile/ProfileIndex";
import ProfilePassword from "./pages/User/Profile/ProfilePassword";
import ProductIndex from "./pages/User/Product/ProductIndex";
import ProductAdd from "./pages/User/Product/ProductAdd";
import CategoryIndex from "./pages/User/Category/CategoryIndex";
import CategoryAdd from "./pages/User/Category/CategoryAdd";
import DashboardIndex from "./pages/User/Dashboard/DashboardIndex";
import OrderIndex from "./pages/User/Order/OrderIndex";

import PaymentSuccess from "./pages/PaymentSuccess";
import Error401 from "./pages/Error401";
import ProtectedRoute from "../src/ProtectedRoute";

function WebRoute(){
    return(
        <>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/search" element={<Search/>}/>
                <Route path="/product/:id" element={<Product/>}/>
                <Route path="/cart" element={<Cart/>}/>
                <Route path="/success" element={<PaymentSuccess/>}/>

                {/* PROFILE  */}
                <Route path="/user/profile/index" element={<ProfileIndex/>}/>
                <Route path="/user/profile/password" element={<ProfilePassword/>}/>

                {/* PRODUCTS */}
                <Route 
                    path="/user/product/index" 
                    element={
                        <ProtectedRoute requiredRole="Admin">
                            <ProductIndex />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/user/product/add" 
                    element={
                        <ProtectedRoute requiredRole="Admin">
                            <ProductAdd />
                        </ProtectedRoute>
                    } 
                />

                {/* CATEGORY */}
                <Route 
                    path="/user/category/index" 
                    element={
                        <ProtectedRoute requiredRole="Admin">
                            <CategoryIndex />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/user/category/add" 
                    element={
                        <ProtectedRoute requiredRole="Admin">
                            <CategoryAdd />
                        </ProtectedRoute>
                    } 
                />

                {/* ORDER */}
                <Route path="/user/order/index" element={<OrderIndex />}/>

                {/* DASHBOARD */}
                <Route 
                    path="/user/dashboard/index" 
                    element={
                        <ProtectedRoute requiredRole="Admin">
                            <DashboardIndex />
                        </ProtectedRoute>
                    } 
                />

                {/* ERROR HANDLING */}
                <Route path="/error" element={<Error401 />} />
            </Routes>        
        </>
    );
}

export default WebRoute;