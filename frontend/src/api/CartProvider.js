import React, { createContext, useContext, useEffect, useState } from "react";
import AuthContext from "./AuthProvider";
import api from "./ApiLink";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const { auth } = useContext(AuthContext);
    const [cart, setCart] = useState([]);
    const [numberCart, setNumberCart] = useState(0);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await api.get('cart/index', {
                    headers: {
                        'Authorization': `Token ${auth.token}`
                    }
                });
                if (response.status == 200) {
                    const cartData = JSON.parse(response.data.cart.data);
                    setCart(cartData);
                    setNumberCart(cartData.length);
                }
            } catch (error) {
                console.error("Error fetching cart data:", error);
            }
        };

        if (auth && auth.token) {
            fetchCart();
        }
    }, [auth,setCart,setNumberCart]);

    return (
        <CartContext.Provider value={{ cart, setCart, numberCart, setNumberCart}}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
