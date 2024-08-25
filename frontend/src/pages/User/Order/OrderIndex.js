import { useState, useEffect, useContext, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../../api/ApiLink";
import AuthContext from "../../../api/AuthProvider";
import UserLayout from "../Layouts/UserLayout";
import Rectangle from "../../../components/Rectangle";
import OrderRate from "./OrderRate";
import { formatDate, formatMoney } from "../../../utils/Helper";
import Message from "../../../components/Message";

function OrderIndex() {
    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    };

    const navigate = useNavigate();
    const initialType = useQuery().get('type') || '';
    const [type, setType] = useState(initialType);
    const { auth } = useContext(AuthContext);
    const [activePage, setActivePage] = useState('order');
    const [transactions, setTransactions] = useState([]);
    const [products, setProducts] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [users, setUsers] = useState([]);
    const [ratingId, setRatingId] = useState(null);
    const [transactionId, setTransactionId] = useState(null);
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');
    const transactionRef = useRef(null); // Ref to measure transaction height

    const [endSlice, setEndSlice] = useState(1); // Dynamic endSlice

    const fetchTransactions = useCallback(async () => {
        try {
            let link = ''
            if (type !== '') {
                link = `?type=${type}`;
            }
            const formData = new FormData();
            formData.append('type', type);
            const response = await api.post('transaction/test', formData, {
                headers: {
                    "Authorization": `Token ${auth.token}`
                }
            });
            setTransactions(response.data.transactions);
            navigate(link);
        } catch (error) {
            console.error(error);
        }
    }, [auth.token, type]);

    const fetchProducts = useCallback(async () => {
        const response = await api.get('test/');
        setProducts(response.data.products);
    }, []);

    const fetchRatings = useCallback(async () => {
        const response = await api.get('rating/user_ratings', {
            headers: {
                'Authorization': `Token ${auth.token}`
            }
        });
        setRatings(response.data.ratings);
    }, [auth.token]);

    const fetchUsers = useCallback(async () => {
        try {
            const response = await api.get('user/retrieve');
            setUsers(response.data.users);
        } catch (error) {
            console.error();
        }
    }, []);

    useEffect(() => {
        fetchTransactions();
        fetchProducts();
        fetchRatings();
        fetchUsers();
    }, [fetchTransactions, fetchProducts, fetchRatings, fetchUsers]);


    const handleScroll = () => {
        //window.scrollY determines how many px was scrolled from top of screen
        //document.documentElement.scrollHeight represents the total height of the document (including the parts that are not yet visible)
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight) {
            setEndSlice((prevEndSlice) => prevEndSlice + 1);
        }
    };

    // Determine how many transactions fit in the viewport
    useEffect(() => {
        const updateEndSlice = () => {
            if (transactionRef.current) {
                const transactionHeight = transactionRef.current.getBoundingClientRect().height; //getBoundingClientRect gets the height of div assgined by transactionRef
                const viewportHeight = window.innerHeight; //innerHeight gets the visible part of browser window of client
                const transactionsInView = Math.floor(viewportHeight / transactionHeight);
                setEndSlice(transactionsInView);
            }
        };

        updateEndSlice();
        window.addEventListener('resize', updateEndSlice); //when window is resized, updateEndSlice function will run again
        window.addEventListener('scroll', handleScroll); //when scrolled, handleScroll function will be called

        return () => { //clean up function
            window.removeEventListener('resize', updateEndSlice);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const closeModal = () => {
        setRatingId(null);
        setTransactionId(null);
    };

    const handleRatingSuccess = () => {
        setRatingId(null);
        setTransactionId(null);
        fetchTransactions();
        fetchRatings();
    };

    const handleProductShip = async (id) => {
        try {
            const response = await api.post(`transaction/update_ship/${id}`, {
                headers: {
                    'Authorization': `Token ${auth.token}`
                }
            });
            setStatus('success');
            setMessage('Product has been shipped. Customer is waiting to receive the item.');
        } catch (error) {
            setStatus('failed');
            setMessage('Product has not been shipped. Server Error.');
            console.error(error);
        } finally {
            handleRatingSuccess();
            setTimeout(() => {
                setStatus('');
                setMessage('');
            }, 1000);
        }
    };

    const handleProductReceive = async (id) => {
        try {
            const response = await api.post(`transaction/update_receive/${id}`, {
                headers: {
                    'Authorization': `Token ${auth.token}`
                }
            });
            setStatus('success');
            setMessage('Product has been received.');
        } catch (error) {
            setStatus('failed');
            setMessage('Product has not been received. Server Error.');
            console.error(error);
        } finally {
            handleRatingSuccess();
            setTimeout(() => {
                setStatus('');
                setMessage('');
            }, 1000);
        }
    };

    return (
        <UserLayout setActivePage={setActivePage} activePage={activePage}>
            {status && message && (
                <Message status={status} message={message} />
            )}
            {ratingId && transactionId && (
                <OrderRate closeModal={closeModal} transactionId={transactionId} ratingId={ratingId} handleRatingSuccess={handleRatingSuccess} />
            )}
            <div className="flex flex-row justify-around gap-4 text-center mb-20 h-12">
                <div className={`flex items-center justify-center w-full h-full cursor-pointer hover:bg-gray-100 
                    ${type === '' || type === 'all' ? 'bg-gray-100' : ''}`}
                    onClick={() => setType('all')}>
                    All
                </div>
                <div className={`flex items-center justify-center w-full h-full cursor-pointer hover:bg-gray-100 
                    ${type === 'pending' ? 'bg-gray-100' : ''}`}
                    onClick={() => setType('pending')}>
                    Pending
                </div>
                <div className={`flex items-center justify-center w-full h-full cursor-pointer hover:bg-gray-100 
                    ${type === 'receive' ? 'bg-gray-100' : ''}`}
                    onClick={() => setType('receive')}>
                    To Receive
                </div>
                <div className={`flex items-center justify-center w-full h-full cursor-pointer hover:bg-gray-100 
                    ${type === 'rate' ? 'bg-gray-100' : ''}`}
                    onClick={() => setType('rate')}>
                    To rate
                </div>
                <div className={`flex items-center justify-center w-full h-full cursor-pointer hover:bg-gray-100 
                    ${type === 'completed' ? 'bg-gray-100' : ''}`}
                    onClick={() => setType('completed')}>
                    Completed
                </div>
            </div>
            {transactions && transactions.length > 0 ? transactions.slice(0, endSlice).map((transaction, index) => {
                const user = users.find(u => u.id === transaction.user);
                let descriptions = [];
                let cleanedDescription = transaction.description.trim();
                cleanedDescription = cleanedDescription.replace(/'/g, '"');
                descriptions = JSON.parse(cleanedDescription);

                return (
                    <div className={`w-full h-auto border border-1 border-gray-300 shadow-md p-8 my-4 transition-opacity duration-500 ${index != 0 ? 'opacity-100 animate-fadeIn' : ''}`}
                        key={transaction.id} 
                        ref={index === 0 ? transactionRef : null}>
                        {auth && auth.type === 'Admin' && (
                            <div className="flex px-4 mb-2">
                                Customer username: <span className="font-bold ms-2">{user ? user.username : "---"}</span>
                            </div>
                        )}
                        <div className="flex font-bold px-4 mb-2">
                            <div className="me-auto">
                                {transaction.created_at ? formatDate(transaction.created_at) : '---'}
                            </div>
                            <div>
                                {transaction.status}
                            </div>
                        </div>
                        <div className="w-full border border-1 border-gray-300"></div>
                        {descriptions.map((description, index) => {
                            const product = products.find(p => p.id === description.product_id);
                            const price = product ? product.price * description.product_quantity : 0;
                            const rating = ratings.find(r => r.id === description.rating_id);
                            if (product) {
                                return (
                                    <div key={index} className="flex lg:flex-row flex-col items-center px-4 my-4">
                                        <div>
                                            {product.image ? (
                                                <img src={`http://127.0.0.1:8000/${product.image}`} className='h-32 w-40 m-auto bg-cover' alt={product.name} />
                                            ) : <Rectangle />}
                                        </div>
                                        <div className="flex flex-col md:ms-2 ms-0 md:me-auto me-0 md:text-left text-center px-2">
                                            <p>{product.name}</p>
                                            <p>x{description.product_quantity}</p>
                                        </div>
                                        <div>
                                            <p className="text-center">₱ {price ? formatMoney(price) : 0}</p>
                                            {transaction.status === 'To Rate' && rating.status === 'To Rate' && (
                                                <button className="bg-sky-700 hover:opacity-90 text-white px-12 py-4 rounded-md"
                                                    onClick={() => {
                                                        setTransactionId(transaction.id);
                                                        setRatingId(rating.id);
                                                    }}>
                                                    Rate now
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            }
                        })}
                        <div className="w-full border border-1 border-gray-300"></div>
                        <div className="flex items-center justify-end gap-2 px-2 my-4">
                            <div>Order Total:</div>
                            <div className="font-bold text-3xl">
                                ₱ {transaction.total_amount ? formatMoney(transaction.total_amount) : 0}
                            </div>
                        </div>
                        <div className="flex md:flex-row flex-col md:justify-end justify-center gap-4">
                            {auth && auth.type === 'Admin' && transaction.status === 'Pending' && (
                                <button className="bg-sky-700 hover:opacity-90 text-white px-12 py-4 rounded-md"
                                    onClick={() => handleProductShip(transaction.id)}>
                                    Shipped
                                </button>
                            )}
                            {auth && auth.type === 'Customer' && transaction.status === 'To Receive' && (
                                <button className="bg-sky-700 hover:opacity-90 text-white px-12 py-4 rounded-md"
                                    onClick={() => handleProductReceive(transaction.id)}>
                                    Receive
                                </button>
                            )}
                        </div>
                    </div>
                );
            }) : 
            <div className="text-center">
                No transactions yet
            </div>
            }
        </UserLayout>
    );
}

export default OrderIndex;
