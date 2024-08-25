import { useState, useContext, useMemo, Suspense } from 'react';
import "react-toastify/dist/ReactToastify.css"; 
import api from '../api/ApiLink';
import { createResource,fetchSingleProduct,fetchProductRatings,fetchUsers } from '../api/FetchData';
import AuthContext from '../api/AuthProvider';
import CartContext from '../api/CartProvider';
import Test from '../components/Test';
import Footer from '../components/Footer';
import Rectangle from '../components/Rectangle';
import { useParams } from 'react-router-dom';
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import { IoPersonCircleOutline } from "react-icons/io5";
import { formatMoney, formatDate } from '../utils/Helper';
import { GoCheckCircle } from "react-icons/go";
import { RxCrossCircled } from "react-icons/rx";

function ProductInfoSkeleton() {
    return (
        <>
            <div className='flex flex-1 text-center mx-auto'>
                <div className="bg-gray-200 h-96 w-96"/>
            </div>
            <div className='flex flex-1 flex-col'>
                <div className="bg-gray-200 rounded-md h-8 w-40 mb-3"/>
                <div className="bg-gray-200 rounded-md h-8 w-3/5 mb-3"/>
                <div className="bg-gray-200 rounded-md h-8 w-32 mb-3"/>
                <div className="bg-gray-200 rounded-md h-20 w-full mb-3"/>
                <div className="bg-gray-200 rounded-md h-8 w-2/5 mb-3"/>
                <div className="bg-gray-200 rounded-md h-20 w-2/5 mb-3"/>
            </div>
        </>
    )
}

function ProductInfo({productResource,ratingResource,setNotify,setMessage,setIsSuccess}){
    const product = productResource.read();
    const ratings = ratingResource.read();
    const { auth } = useContext(AuthContext);
    const { setCart,setNumberCart } = useContext(CartContext);
    const [quantity, setQuantity] = useState(1);

    const AvgRating = () => {
        const stars = [];
        let avg = 0;

        if (ratings.length > 0) {
            for (let index = 0; index < ratings.length; index++) {
                avg += ratings[index].star;
            }
            avg /= ratings.length;
            for (let index = 0; index < parseInt(avg); index++) {
                stars.push(<FaStar key={`full-${index}`} className='flex inline-flex text-sky-700 mt-1' />);
            }
            let temp = 5 - parseInt(avg);
            for (let index = 0; index < temp; index++) {
                stars.push(<FaRegStar key={`empty-${index}`} className='flex inline-flex text-sky-700 mt-1' />);
            }
        } else {
            for (let index = 0; index < 5; index++) {
                stars.push(<FaRegStar key={`none-${index}`} className='flex inline-flex text-sky-700 mt-1' />);
            }
        }

        return ratings.length > 0 ? (
            <div className='flex md:flex-row flex-col'>
                <span className='underline'>{avg.toFixed(1)}</span>
                <span className='flex flex-inline ms-2'>{stars}</span>
            </div>
        ) : (
            <div className='flex md:flex-row flex-col'>
                <span className='underline'>{avg.toFixed(1)}</span>
                <span className='flex flex-inline ms-2'>{stars}</span>
            </div>
        );
    }

    const removeQuantity = () => {
        setQuantity(quantity => Math.max(1, quantity - 1));
    }

    const addQuantity = () => {
        setQuantity(quantity => Math.min(product.quantity, quantity + 1));
    }

    const handleCart = async (e) => {
        e.preventDefault();
        if (auth) {
            try {
                const formData = new FormData();
                formData.append('product_id', product.id);
                formData.append('quantity', quantity);
                const response = await api.post('cart/store', formData, {
                    headers: {
                        'Authorization': `Token ${auth.token}`
                    }
                });
                const updatedCart = JSON.parse(response.data.cart);
                setCart(updatedCart);   
                setNumberCart(updatedCart.length);
                setIsSuccess(true);
                setNotify(true);
                setMessage("Item has been added to your shopping cart");
                setTimeout(() => {
                    setIsSuccess(false);
                    setNotify(false);
                    setMessage("");
                },2000);
            } catch (error) {
                if (error.response.status == 400) {             
                    setMessage("The quantity of items in your shopping cart exceeds the available stock limit");
                } else if (error.response.status == 400) {
                    setMessage("Please log in before adding items to your cart");
                } else {
                    setMessage("System Error. Please again later");
                }
                setNotify(true);
                setTimeout(() => {
                    setNotify(false);
                    setMessage("");
                },2000);
            }
        } else {
            setMessage("Please log in before adding items to your cart");
            setNotify(true);
            setTimeout(() => {
                setNotify(false);
                setMessage("");
            },2000);
        }
    };

    return (
        <>
            <div className='flex flex-1 text-center mx-auto'>
                {product.image ? (
                    <img src={`http://127.0.0.1:8000/${product.image}`} className='w-96' alt={product.name} />
                ) : <Rectangle />}
            </div>
            <div className='flex flex-1 flex-col'>
                <p className='text-2xl font-bold mb-2'>{product.name}</p>
                <div className='flex inline-flex gap-8'>
                    <AvgRating />
                    <p className='text-gray-500 md:block hidden'>|</p>
                    <p><span className='underline'>{ratings.length}</span> <span className='text-gray-500'>Ratings</span></p>
                    <p className='text-gray-500 md:block hidden'>|</p>
                    <p><span className='underline'>{product.total_sold}</span> <span className='text-gray-500'>Sold</span></p>
                </div>
                <p className='text-3xl font-bold text-sky-700 my-4'>₱ {product.price ? formatMoney(product.price) : 0}</p>
                <p className='mb-4'>{product.description}</p>
                <form onSubmit={handleCart}>
                    <div className="flex items-center mx-auto md:mx-0 md:justify-normal justify-center">
                        <div className={`${quantity <= 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} border border-gray-300 bg-white text-black w-12 h-8 hover:opacity-70 text-center`} 
                            onClick={removeQuantity}>
                            -
                        </div>
                        <div name="quantity" className="border border-gray-300 text-center w-12 h-8">
                            {quantity}
                        </div>
                        <div className={`${quantity >= product.quantity ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} border border-gray-300 bg-white text-black w-12 h-8 hover:opacity-70 text-center`} 
                            onClick={addQuantity}>
                            +
                        </div>
                        <span className='md:block hidden text-gray-500 text-xs ms-3'>{product.quantity} pcs available</span>
                    </div>
                    <div className='md:hidden block text-gray-500 text-xs mt-4'>{product.quantity} pcs available</div>
                    <button type="submit" className='bg-sky-700 hover:opacity-75 text-white rounded-md w-48 h-12 mt-8'>
                        Add to cart
                    </button>
                </form>
            </div>
        </>
    )
}

function ProductRatingSkeleton() {
    return (
        <>
            <div>
                <div className='mx-2'>
                    <div className="flex flex-inline">
                        <IoPersonCircleOutline className='text-gray-200 w-16 h-16 mt-3' />
                        <span className='mt-1 ms-2'>
                            <div className="bg-gray-200 rounded-md h-4 w-40 mb-1"/>
                            <div className="bg-gray-200 rounded-md h-4 w-40 mb-1"/>
                            <div className="bg-gray-200 rounded-md h-4 w-40 mb-1"/>
                        </span>
                    </div>
                    <div className='md:mx-16'>
                        <div className="bg-gray-200 rounded-md h-20 w-full mb-3"/>
                    </div>
                </div>
                <hr className='my-8' />
            </div>
        </>
    )
}

function ProductRating({ratingResource,userResource}) {
    const ratings = ratingResource.read();
    const users = userResource.read();

    const StarRating = ({ rating }) => {
        const stars = [];
        if (rating.star === 5) {
            for (let index = 0; index < rating.star; index++) {
                stars.push(<FaStar key={`rating-full-${index}`} className='flex inline-flex text-sky-700' />);
            }
        } else {
            let temp = 5 - rating.star;
            for (let index = 0; index < rating.star; index++) {
                stars.push(<FaStar key={`rating-full-${index}`} className='flex inline-flex text-sky-700' />);
            }
            for (let index = 0; index < temp; index++) {
                stars.push(<FaRegStar key={`rating-empty-${index}`} className='flex inline-flex text-sky-700' />);
            }
        }
        return <div>{stars}</div>;
    }

    return (
        <>
            {ratings && ratings.length > 0 ? (
                ratings.map((rating, index) => {
                    const user = users.find(u => u.id === rating.user);
                        if (user) {
                            return (
                                <div key={rating.id}>
                                    <div className='mx-2'>
                                        <div className="flex flex-inline">
                                            <IoPersonCircleOutline className='text-sky-700 w-16 h-16 mt-3' />
                                            <span className='mt-1 ms-2'>
                                                {user.username}
                                                <StarRating rating={rating} />
                                                <p className='text-xs text-gray-500 mt-1'>{formatDate(rating.created_at)}</p>
                                            </span>
                                        </div>
                                        <div className='md:mx-16'>
                                            <p className='ms-2 mt-4'>{rating.description}</p>
                                        </div>
                                    </div>
                                    <hr className='my-8' />
                                </div>
                            );
                        } else {
                            return null;
                        }
                    })
            ) : (
                <p className='text-center'>No ratings for this product yet.</p>
            )}
        </>
    )
}

function Product() {
    const { id } = useParams();
    const productResource = useMemo(() => createResource(fetchSingleProduct(id)), [id]);
    const ratingResource = useMemo(() => createResource(fetchProductRatings(id)), [id]);
    const userResource = useMemo(() => createResource(fetchUsers()), []);

    const [notify,setNotify] = useState(false);
    const [message,setMessage] = useState("");
    const [isSuccess,setIsSuccess] = useState(false);

    return (
        <>
            <Test />
            {notify && (
                <div className={`fixed inset-0 z-50 flex items-center justify-center`}>
                    <div className="bg-black bg-opacity-70  visible opacity-100 text-white p-6 w-96">
                        {isSuccess ? <GoCheckCircle className="text-green-500 h-16 w-16 m-auto"/>
                            : <RxCrossCircled className='text-red-500 h-16 w-16 m-auto'/>}
                        <p className="text-center font-bold my-4">{message}</p>
                    </div>
                </div>
            )}
            <section className="flex flex-col min-h-screen max-h-auto justify-center items-center md:px-48 p-12">
                <div className='border-solid border border-e1e1e1 rounded-md min-h-4/5 h-auto w-full p-16 text-center md:text-justify'>
                    <div className='flex flex-col lg:flex-row'>
                        <Suspense fallback={<ProductInfoSkeleton/>}>
                            <ProductInfo productResource={productResource} ratingResource={ratingResource}
                                setNotify={setNotify} setMessage={setMessage} setIsSuccess={setIsSuccess}/>
                        </Suspense>     
                    </div>
                </div>

                <div className='border-solid border border-e1e1e1 rounded-md min-h-4/5 h-auto w-full p-16 text-center md:text-justify mt-4'>
                    <p className='text-2xl font-bold mb-12'>Product Ratings</p>
                    <Suspense fallback={<ProductRatingSkeleton/>}>
                        <ProductRating ratingResource={ratingResource} userResource={userResource}/>
                    </Suspense>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default Product;
