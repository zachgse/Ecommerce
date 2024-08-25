import UserModal from "../Layouts/UserModal";
import { useState,useRef,useEffect,useContext } from "react";
import api from "../../../api/ApiLink";
import AuthContext from "../../../api/AuthProvider";
import Message from "../../../components/Message";
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import Rectangle from "../../../components/Rectangle";
import { useNavigate } from "react-router-dom";

const OrderRate = (props) => {
    const {auth} = useContext(AuthContext)
    const navigate = useNavigate();
    const rateRef = useRef(null);
    const transactionId = props.transactionId;
    const ratingId = props.ratingId;    
    const [transaction,setTransaction] = useState([]);
    const [rating,setRating] = useState([]);
    const [products,setProducts] = useState([]);
    const [product,setProduct] = useState([]);
    const [inputDescription,setInputDescription] = useState('');
    const [inputStar,setInputStar] = useState(0);
    const [status,setStatus] = useState('');
    const [message,setMessage] = useState('');

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (rateRef.current && !rateRef.current.contains(e.target)) {
                props.closeModal();
            }
        }

        document.addEventListener('mousedown',handleClickOutside);

        return(() => {
            document.removeEventListener('mousedown',handleClickOutside);
        })
    },[props]);

    useEffect(() => {
        if (transactionId || ratingId) {
            const fetchTransaction = async(transactionId) => {
                try {
                    const response = await api.get(`transaction/show/${transactionId}`);
                    setTransaction(response.data.transaction);
                } catch (error) {
                    console.error(error);
                }
            }

            const fetchRating = async(ratingId) => {
                try {
                    const response = await api.get(`rating/show/${ratingId}`);
                    setRating(response.data.rating);
                } catch (error) {
                    console.error(error);
                }
            }

            const fetchProducts = async() => {
                try{
                    const response = await api.get('test/');
                    setProducts(response.data.products);
                } catch (error) {
                    console.error(error);
                }
            }

            fetchTransaction(transactionId);
            fetchRating(ratingId);
            fetchProducts();
        }
    },[transactionId,ratingId]);

    useEffect(() => {
        if (rating && products.length > 0) {
            const temp = products.find(p => p.id === rating.product);
            setProduct(temp);
        }
    }, [rating, products]);

    const handleSubmit = async(e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('rating_id',rating.id);
        formData.append('transaction_id',transaction.id);
        formData.append('star',inputStar);
        formData.append('description',inputDescription);

        try {
            const response = await api.post('rating/store_rate', formData, {
                headers: {
                    'Authorization': `Token ${auth.token}`
                }
            });
            console.log("response:",response);
            setStatus("success");
            setMessage("Product has been rated.");
        } catch (error) {
            setStatus('failed');
            setMessage("Product has not been rated.");
        } finally {
            setTimeout(() => {
                setInputStar('');
                setInputDescription('');
                setStatus('');
                setMessage('');
                props.handleRatingSuccess();
                props.closeModal();
            },1000);
        }
    }

    return (
        <UserModal>
            {status && (
                <Message status={status} message={message}/>
            )}
            <div ref={rateRef}>
                <IoMdCloseCircleOutline onClick={props.closeModal} className='text-gray-500 h-6 w-6 ml-auto hover:cursor-pointer mb-5'/>
                <p className="text-2xl font-bold">Rate Product</p>
                <div className="w-auto border border-1 border-gray-200 my-4"></div>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="flex md:flex-wrap flex-wrap-reverse justify-center items-center gap-8">
                        <div className="md:flex-auto flex-none">
                            <div className="text-center mb-4">
                                <b>{product ? product.name : '---'}</b>
                            </div>
                            <div className="mb-4">
                                {product ? (
                                        <img src={`http://127.0.0.1:8000/${product.image}`} className='h-40 w-auto m-auto' alt={product.name} />
                                ) : <Rectangle />}         
                            </div>
                            <div className="flex justify-center items-center gap-1 mb-4">
                                {inputStar && inputStar >= 1 ? <FaStar className="text-sky-700 w-12 h-12 hover:cursor-pointer"  onClick={(() => setInputStar(1))}/>
                                    : <FaRegStar className="text-sky-700 w-12 h-12 hover:cursor-pointer"  onClick={(() => setInputStar(1))}/>
                                }
                                {inputStar && inputStar >= 2 ? <FaStar className="text-sky-700 w-12 h-12 hover:cursor-pointer"  onClick={(() => setInputStar(2))}/>
                                    : <FaRegStar className="text-sky-700 w-12 h-12 hover:cursor-pointer"  onClick={(() => setInputStar(2))}/>
                                }
                                {inputStar && inputStar >= 3 ? <FaStar className="text-sky-700 w-12 h-12 hover:cursor-pointer" onClick={(() => setInputStar(3))}/>
                                    : <FaRegStar className="text-sky-700 w-12 h-12 hover:cursor-pointer" onClick={(() => setInputStar(3))}/>
                                }
                                {inputStar && inputStar >= 4 ? <FaStar className="text-sky-700 w-12 h-12 hover:cursor-pointer" onClick={(() => setInputStar(4))}/>
                                    : <FaRegStar className="text-sky-700 w-12 h-12 hover:cursor-pointer" onClick={(() => setInputStar(4))}/>
                                }
                                {inputStar && inputStar >= 5 ? <FaStar className="text-sky-700 w-12 h-12 hover:cursor-pointer" onClick={(() => setInputStar(5))}/>
                                    : <FaRegStar className="text-sky-700 w-12 h-12 hover:cursor-pointer" onClick={(() => setInputStar(5))}/>
                                }                                                                                                            
                            </div>
                            <div className="mb-4">
                                <label className="font-semibold my-3 ms-1">Description</label>
                                <textarea name="description" value={inputDescription} onChange={(e) => setInputDescription(e.target.value)}
                                    className="border-solid border border-e1e1e1 rounded-md w-full h-32 p-4"/>
                            </div>
                        </div>                      
                    </div>
                    <div className="flex-grow"></div>
                    <div className="relative mt-32">
                        <button className="bg-sky-700 hover:opacity-90 text-white px-12 py-4 rounded-md w-40 ml-auto absolute bottom-0 right-0">
                            Rate
                        </button>
                    </div>
                </form>
            </div>
        </UserModal>

    )

}

export default OrderRate;