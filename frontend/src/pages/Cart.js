import { useState,useEffect,useContext,useRef } from "react";
import { Link } from "react-router-dom";
import api from "../api/ApiLink";
import AuthContext from "../api/AuthProvider";
import CartContext from "../api/CartProvider";
import Test from "../components/Test";
import { MdDeleteOutline } from "react-icons/md";
import { formatMoney } from "../utils/Helper";
import { GoCheckCircle } from "react-icons/go";

function Cart() {
    const {auth} = useContext(AuthContext);
    const {cart,setCart,setNumberCart} = useContext(CartContext);
    const [isLoggedIn,setIsLoggedIn] = useState(false);
    const [products,setProducts] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [prices, setPrices] = useState({});
    const [removeItem, setRemoveItem] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isAllSelected,setIsAllSelected] = useState(false);
    const [totalPrice,setTotalPrice] = useState(0);
    const [checkoutUrl,setCheckoutUrl] = useState(null);
    const removeItemRef = useRef(null);
    const [notify,setNotify] = useState(false);

    useEffect(() => {
        if (auth) {
            setIsLoggedIn(true);
        }

        const fetchProducts = async() => {
            const response = await api.get('test/');
            setProducts(response.data.products);
        }

        fetchProducts();
    },[])

    useEffect(() => {
        if (isLoggedIn) {
            const fetchCart = async () => {
                try {
                    const response = await api.get('cart/index', {
                        headers: {
                            'Authorization': `Token ${auth.token}`
                        }
                    });
                    const cartData = JSON.parse(response.data.cart.data);
                    setCart(cartData);
    
                    const initialQuantities = {};
                    cartData.forEach(item => {
                        initialQuantities[item.product_id] = item.quantity;
                    });
                    setQuantities(initialQuantities);
    
                    const initialPrices = {};
                    cartData.forEach(item => {
                        const product = products.find(prod => prod.id === item.product_id);
                        if (product) {
                            initialPrices[item.product_id] = product.price * item.quantity;
                        }
                    });
                    setPrices(initialPrices);
                } catch (error) {
                    console.error("Error fetching cart:", error);
                }
            };
    
            fetchCart();
        }

    },[auth,cart,quantities,prices]);

    useEffect(() => {
        let total = 0;
        selectedProducts.forEach(productId => {
            if (prices[productId]) {
                total += prices[productId];
            }
        });
        setTotalPrice(total);
    }, [prices, selectedProducts]);

    useEffect(() => {
        if(checkoutUrl){
            window.location.href = checkoutUrl;
        }
    },[checkoutUrl]);

    const handleQuantityChange = (productId, newQuantity) => {
        products.forEach(async item => {
            if (productId === item.id) {
                if (newQuantity > 0 && newQuantity <= item.quantity) {
                    const type = newQuantity < quantities[productId] ? 'remove' : 'add';
                    try{
                        const formData = new FormData();
                        formData.append('product_id',productId);
                        formData.append('type',type);
                        const response = await api.post('cart/update',formData, {
                            headers: {
                                'Authorization': `Token ${auth.token}`
                            }
                        });
                        const cartData = JSON.parse(response.data.cart.data);
                        setCart(cartData);
                        setQuantities(prevQuantities => ({
                            ...prevQuantities,
                            [productId]: newQuantity
                        }));
                        setPrices(prevPrices => ({
                            ...prevPrices,
                            [productId]: item.price * newQuantity
                        }));           
                    } catch(error){
                        console.error(error)
                    }
                } else if (newQuantity === 0) {
                    setSelectedProductId(productId);
                    setRemoveItem(true);
                } else {
                    console.log("Exceed the current quantity");
                }
            }
        });
    }

    const handleDeleteItem = async (productId) => {
        try {
            const formData = new FormData();
            formData.append('product_id', productId);
            const response = await api.post('cart/delete', formData, {
                headers: {
                    'Authorization': `Token ${auth.token}`
                }
            });
            const cartData = JSON.parse(response.data.cart);
            setCart(cartData);
            setNumberCart(cartData.length);
            setRemoveItem(false);
            setNotify(true);
            setTimeout(()=>{
                setNotify(false)
            },2000);
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    }

    const handleClickOutside = (event) => {
        if (removeItemRef.current && !removeItemRef.current.contains(event.target)) {
            setRemoveItem(false);
        }
    }

    useEffect(() => {
        if (removeItem) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [removeItem]);

    const handleCheckout = async () => {
        if (selectedProducts) {
            try{    
                const formData = new FormData();
                formData.append('items',selectedProducts);
                const response = await api.post('cart/checkout', formData, {
                    headers: {
                        "Authorization": `Token ${auth.token}`
                    }
                });
                const link = (response['data']);
                const url = link.message
                setCheckoutUrl(url)
            } catch(error){
                console.error(error)
            }
        }

    }   

    const handleCheckboxChange = (productId) => {
        setSelectedProducts(prevSelectedProducts => { //prevSelectedProducts => is the current state of the selectedProducts
          if (prevSelectedProducts.includes(productId)) { //checks if the product id is already inside the state
            return prevSelectedProducts.filter(id => id !== productId); //removes the item if it matches id
          } else {
            return [...prevSelectedProducts, productId]; //... is spread operator  like copies the item of array
                                                        // and it appends the productId
          }
        });
    }

    const selectAllProducts = () => {
        if (selectedProducts.length === cart.length) {
            setSelectedProducts([]);
            setIsAllSelected(false);
        } else {
            const selectedProductIds = cart.map(item => item.product_id);
            setSelectedProducts(selectedProductIds);
            setIsAllSelected(true);
        }
    }


    return (
        <>
            <Test/>
            {removeItem && (
                <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${removeItem ? 'visible opacity-100' : 'invisible opacity-0'} transition-opacity duration-300`}>
                    <div ref={removeItemRef} className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <h2 className="text-xl text-center font-bold mb-4">Confirmation</h2>
                        <p className="text-center mb-4">Are you sure you want to remove this item?</p>
                        <div className="flex justify-center gap-4">
                            <button className="bg-red-700 hover:opacity-90 text-white px-4 py-2 rounded-md cursor-pointer"
                                onClick={() => handleDeleteItem(selectedProductId)}>
                                Remove the item?
                            </button>
                            <button className="bg-slate-100 hover:opacity-90 text-black px-4 py-2 rounded-md cursor-pointer"
                                onClick={() => setRemoveItem(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {notify && (
                <div className={`fixed inset-0 z-50 flex items-center justify-center`}>
                    <div className="bg-black bg-opacity-70  visible opacity-100 text-white p-6 w-96">
                        <GoCheckCircle className="text-green-500 h-16 w-16 m-auto"/>
                        <p className="text-center font-bold my-4">Item has been removed from your shopping cart.</p>
                    </div>
                </div>
            )}
            {auth ?
            (
                <div className="flex max-h-screen w-10/12 m-auto justify-center mt-8">
                    
                    <table className="text-center table-fixed w-full">
                        <thead className="border-solid border border-e1e1e1 h-20">
                            <tr>
                                <th>
                                    <input name="items" checked={isAllSelected} onChange={() => selectAllProducts()} 
                                        type="checkbox" className="w-4 h-4 cursor-pointer"/>
                                </th>
                                <th className="text-gray-500">Product</th>
                                <th className="text-gray-500">Unit Price</th>
                                <th className="text-gray-500">Quantity</th>
                                <th className="text-gray-500">Total Price</th>
                                <th className="text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart && cart.length > 0 && cart.map((cartItem, index) => {
                                const product = products.find(prod => prod.id === cartItem.product_id);
                                if (product) {
                                    return (
                                        <tr key={index} className="border-b border-t border-gray-300">
                                            <td className="py-4">
                                                <input name="items" type="checkbox" className="w-4 h-4 cursor-pointer"
                                                    checked={selectedProducts.includes(product.id)}
                                                    onChange={() => handleCheckboxChange(product.id)}
                                                />
                                            </td>
                                            <td className="py-4">
                                                <img src={`http://127.0.0.1:8000/${product.image}`} alt={product.name} className="md:w-40 md:h-40 m-auto" />
                                                <b>{product.name}</b>
                                            </td>
                                            <td className="py-4">
                                                ₱ {formatMoney(product.price)}
                                            </td>
                                            <td className="py-4">
                                                <div className="flex md:flex-row flex-col justify-center items-center mx-auto">
                                                    <button className="border border-gray-300 bg-white text-black md:w-12 min-w-8 md:h-8 hover:opacity-70" onClick={() => handleQuantityChange(product.id, (quantities[product.id] || 0) - 1)}>
                                                        -
                                                    </button>
                                                    <p className="border border-gray-300 bg-white text-black md:w-12 min-w-8 md:h-8">
                                                        {quantities[product.id] || 0}
                                                    </p>     
                                                    <button onClick={() => handleQuantityChange(product.id, (quantities[product.id] || 0) + 1)}
                                                        className={`${quantities[product.id] >= product.quantity ? 'border border-gray-300 bg-white text-black md:w-12 min-w-8 md:h-8 opacity-50 cursor-not-allowed' 
                                                            : 'border border-gray-300 bg-white text-black md:w-12 min-w-8 md:h-8 hover:opacity-70'}`}>
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                ₱ {prices[product.id] ? formatMoney(prices[product.id]) : 0}
                                            </td>
                                            <td className="py-4">
                                                <MdDeleteOutline className="m-auto cursor-pointer text-2xl text-red-500" onClick={() => { setSelectedProductId(product.id); setRemoveItem(true); }} />
                                            </td>
                                        </tr>
                                    );
                                }
                                return null;
                            })}
                        </tbody>
                    </table>
                    <div className="flex flex-row justify-between border-solid border border-e1e1e1 w-10/12 h-20 absolute bottom-0 flex items-center p-8">
                        <div>
                            <p className="text-xl">Total: ₱ {{totalPrice} ? formatMoney(totalPrice) : 0}</p>
                        </div>
                        <div>
                            <button className="bg-sky-700 hover:opacity-90 text-white px-12 py-4 rounded-md" onClick={() => {handleCheckout()}}>
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>

            ) : (
                <div className="flex min-h-screen justify-center items-center">
                    <div className="flex justify-center items-center">
                        <p className='text-gray-500'>To view your cart, please login <Link className="text-sky-700" to="/login">here.</Link></p>
                    </div>
                </div>
            )}
        </>
    )
}

export default Cart;