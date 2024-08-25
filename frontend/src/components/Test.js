import { useContext, useRef, useState, useEffect, Suspense } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import AuthContext from '../api/AuthProvider';
import CartContext from '../api/CartProvider';
import api from '../api/ApiLink';
import { createResource,fetchSearchProductsNavbar } from '../api/FetchData'
import {ToastContainer,toast} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"; 
import { FaCaretDown } from "react-icons/fa";
import { formatMoney } from '../utils/Helper';
import { TiStarburst } from "react-icons/ti";
import Rectangle from './Rectangle';

function SearchData({ searchResource }) {
    let data;
    let searchedProducts = [];

    if (searchResource) {
        try {
            data = searchResource.read();
            searchedProducts = data || [];
            console.log("Fetched Data:", searchedProducts);
        } catch (error) {
            if (error instanceof Promise) {
                throw error; // Let Suspense handle the loading state
            } else {
                console.error('Error reading search resource:', error);
                searchedProducts = []; // Ensure empty array on error
            }
        }
    } 

    return (
        <>
            {searchedProducts && searchedProducts.length > 0 ? (
                searchedProducts.map((searchedProduct, index) => (
                    <Link to={`/product/${searchedProduct.id}`} key={index} className='flex flex-row justify-start items-center hover:bg-gray-200 hover:cursor-pointer'>
                        {searchedProduct.image ? (
                            <img src={`http://127.0.0.1:8000/${searchedProduct.image}`} className='h-20 w-20 p-2 bg-cover' alt={searchedProduct.name} />
                        ) : <Rectangle />}
                        <p className='ml-2'>{searchedProduct.name}</p>
                    </Link>
                ))
            ) : (
                <div className='h-full flex justify-center items-center'>
                    <p>No products found.</p>
                </div>
            )}
        </>
    );
}

function Test() {
    const {auth,setAuth} = useContext(AuthContext);
    const {cart,numberCart} = useContext(CartContext);
    const [products,setProducts] = useState([]);
    const [searchResource, setSearchResource] = useState(null);
    const [query,setQuery] = useState('');
    const [hoverCart,isHoverCart] = useState(false);
    const [searchOpen,isSearchOpen] = useState(false);
    const searchRef = useRef(null);
    const cartRef = useRef(null);
    const navigate = useNavigate();

    const handleLogout = async(e) => {
        e.preventDefault();
        toast.warn("Logging out...", {
            position: "top-center",
            hideProgressBar: true,
            theme: "colored",
            pauseOnHover: false,
            closeOnClick: true,
            autoClose: 1000,
        });
        setTimeout(async() => {
            try {
                const response = await api.post('user/logout', {}, {
                    headers: {
                        'Authorization': `Token ${auth.token}`
                    }
                });
                toast.success("Logout successful! Redirecting...", {
                    position: "top-center",
                    hideProgressBar: true,
                    theme: "colored",
                    pauseOnHover: false,
                    closeOnClick: true,
                    autoClose: 1500,
                });
                setTimeout(()=> {
                    setAuth(null);
                    navigate('/login');
                },2000)
            } catch (error) {
                console.error("Error",error);
            } 
        },2000)
    }

    useEffect(() => {
        const handleMouseEnter = () => {
            isHoverCart(true);
        }

        const handleMouseLeave = () => {
            isHoverCart(false);
        }

        const handleClick = () => {
            isHoverCart((prevHoverCart) => !prevHoverCart);
        };

        if (cartRef.current) {
            cartRef.current.addEventListener('mouseenter',handleMouseEnter);
            cartRef.current.addEventListener('mouseleave',handleMouseLeave);
            cartRef.current.addEventListener('click', handleClick);
        }

        return () => {
            if (cartRef.current) {
                cartRef.current.removeEventListener('mouseenter', handleMouseEnter);
                cartRef.current.removeEventListener('mouseleave', handleMouseLeave);
                cartRef.current.removeEventListener('click', handleClick);
            }
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                isSearchOpen(false);
            } else {
                isSearchOpen(true);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    },[]);

    useEffect(() => {
        if (searchOpen && query !== '') {
            const resource = createResource(fetchSearchProductsNavbar(query));
            setSearchResource(resource);
        } else {
            setSearchResource(null); // Reset if no query or search is closed
        }
    }, [query, searchOpen ]);

    useEffect(() => {
        const fetchProducts = async() => {
            try{
                const response = await api.get('test/');
                setProducts(response.data.products);
            } catch (error) {
                console.error(error);
            }    
        }
        fetchProducts();
    },[])

    const handleSearch = async(e) => {
        e.preventDefault();
        try{
            navigate(`/search?q=${query}`);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <ToastContainer/>
            <nav className='border-b border-e1e1e1 h-16'>
                <div className='container mx-auto mt-4'>
                    <div className='flex justify-around'>
                        <div className='mt-2'>
                            <Link to="/" className="text-sky-700 md:text-2xl text-sm uppercase font-bold">
                                Logo
                            </Link>
                        </div>
                        <div className="relative">
                            <div className="flex items-center border border-gray-300 rounded-md focus-within:ring focus-within:ring-blue-300 md:w-96 w-60 px-3 py-2">
                                <input type="text" ref={searchRef} name="query" onChange={(e) => setQuery(e.target.value)}
                                    className="ml-2 flex-1 bg-transparent outline-none" placeholder="Search..." autoComplete='off'/>
                                <svg className="w-6 h-6 hover:text-sky-700 hover:cursor-pointer" onClick={handleSearch}
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" 
                                    stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </div>
                            {searchOpen && (
                                <div ref={searchRef} className="overflow-y-auto max-h-96 md:w-96 w-60 bg-white border border-gray-300 rounded-md absolute z-50 p-4">
                                    <Suspense fallback={<div className='text-center'>Searching...</div>}>
                                        <SearchData searchResource={searchResource} />
                                    </Suspense>
                                </div>
                            )}
                        </div>
                        <div className='flex gap-x-4 mt-2'>
                            <div className='relative'  ref={cartRef}>
                                <div className="absolute w-1 h-1 -ms-5 -mt-2">
                                    <TiStarburst className='w-8 h-8 text-sky-700' />
                                    <span className='absolute inset-0 flex items-center justify-center text-white z-50 ms-4 mt-4 text-xs'>{numberCart}</span>
                                </div>
                                <div>
                                    <Link to="/cart">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 hover:text-sky-700 hover:cursor-pointer">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                        </svg>
                                    </Link>
                                    {hoverCart && (
                                        <div className='h-96 md:w-96 w-80 bg-white border border-white-700 rounded-md absolute mt-1 md:-ms-[360px] -ms-[300px] z-50'>
                                            {auth ? (
                                                <div className='flex flex-col justify-start p-2 h-full'>
                                                    <p className='text-gray-500 text-xs mb-5'>Recently Added Products</p>
                                                    {cart && cart.length > 0 && cart.map((cartItem, index) => {
                                                        const product = products.find(p => p.id === cartItem.product_id);
                                                        if (product) {
                                                            return (
                                                                <div key={index} className="flex flex-row items-center justify-between hover:bg-gray-100">
                                                                    <img src={`http://127.0.0.1:8000/${product.image}`} alt={product.name} className="w-12 h-12" />
                                                                    <p>{product.name}</p>
                                                                    <p>₱ {formatMoney(product.price)}</p>
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    })}
                                                    <Link to="/cart">
                                                        <button className="bg-sky-700 hover:opacity-90 text-white px-4 py-2 rounded-md absolute bottom-5 right-5">
                                                            View my shopping cart
                                                        </button>
                                                    </Link>
                                                </div>
                                            ) : (
                                                
                                                <div className='h-full flex justify-center items-center '>
                                                    <p className='text-gray-500'>To view your cart, please login <Link className="text-sky-700" to="/login">here.</Link></p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {auth ? (
                                <>
                                    <div className="relative dropdown">
                                        <button className="flex items-center justify-center hover:text-sky-700 hover:cursor-pointer dropdown-button">
                                            {auth.username} <FaCaretDown />
                                        </button>
                                        <div className="dropdown-content absolute right-0 mt-2 w-56 bg-white border border-white-700 rounded-md">
                                            <div className="py-1">
                                                <div>
                                                    <Link className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" to="/user/profile/index">Profile</Link>                               
                                                </div>
                                                <div>
                                                    <form onSubmit={handleLogout} onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        type="submit"
                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        Logout
                                                    </button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) :  (
                                <>
                                    <div>
                                        <Link className='hover:text-sky-700 hover:cursor-pointer' to="/login">
                                            Login
                                        </Link>                              
                                    </div>   
                                    <div>
                                        <Link className='hover:text-sky-700 hover:cursor-pointer' to="/register">
                                            Register
                                        </Link>                
                                    </div> 
                                </>
                            )}
                        </div>

                    </div>           
                </div>
            </nav>  
        </>
    );
}

export default Test;