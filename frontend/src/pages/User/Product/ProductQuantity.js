import { useEffect,useRef,useState } from "react";
import api from "../../../api/ApiLink";
import UserModal from "../Layouts/UserModal";
import Message from "../../../components/Message";
import { IoMdCloseCircleOutline } from "react-icons/io";

const ProductQuantity = (props) => {
    const quantityRef = useRef(null);
    const [product,setProduct] = useState([]);
    const productId = props.productId;
    const [productName,setProductName] = useState('');
    const [productQuantity,setProductQuantity] = useState(0);
    const [inputQuantity,setInputQuantity] = useState(1);
    const [status,setStatus] = useState('');
    const [message,setMessage] = useState('');

    useEffect(()=>{
        const handleClickOutside = (e) => {
            if (quantityRef.current && !quantityRef.current.contains(e.target)){
                props.closeQuantityModal();
            }
        }

        document.addEventListener('mousedown',handleClickOutside);

        return () => {
            document.removeEventListener('mouseenter',handleClickOutside);
        }
    },[props]);

    useEffect(()=>{
        if (productId) {
            const fetchProduct = async(productId) => {
                try {
                    const response = await api.get(`test/product/${productId}`);
                    setProduct(response.data.product);
                } catch (error) {
                    console.error("Error message:",error);
                }
            }

            fetchProduct(productId);
        }
    },[productId,status])

    const addQuantity = () => {
        setInputQuantity(inputQuantity => inputQuantity + 1);
    }

    const removeQuantity = () => {
        if (inputQuantity > 1) {
            setInputQuantity(inputQuantity => inputQuantity - 1);
        }
    }

    useEffect(() => {
        if (product) {
            setProductName(product.name || '');
            setProductQuantity(product.quantity || 0);
        }
    }, [product]);

    const handleSubmit = async(e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('id',productId);
        formData.append('quantity',inputQuantity);

        try {
            const response = await api.put('test/product/update_quantity',formData);
            setStatus('success');
            setMessage('Product has been updated.');
            setTimeout(() => {
                setStatus('');
                setMessage('');
            },1000);
        } catch (error) {
            setStatus('failed');
            setMessage('Product has not been updated.');
            setTimeout(() => {
                setStatus('');
                setMessage('');
            },1000);
            console.error(error);
        }
    }

    return (
        <UserModal>
            {status && (
                <Message status={status} message={message}/>
            )}
            <div ref={quantityRef}>
                <IoMdCloseCircleOutline onClick={props.closeQuantityModal} className='text-gray-500 h-6 w-6 ml-auto cursor-pointer mb-5'/>
                <p className="text-2xl font-bold">Edit Quantity</p>
                <div className="w-auto border border-1 border-gray-200 my-4"></div>
                <div className="mb-4">
                    <label className="font-semibold my-3 me-5">Product Name:</label>
                    {productName}
                </div>
                <div className="mb-4">
                    <label className="font-semibold my-3 me-5">Current Product Quantity:</label>
                    {productQuantity}
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-start items-center mx-auto text-center">
                        <p className="font-semibold my-3 me-5">Add Product Quantity</p>
                        <div className={`${inputQuantity <= 1 ? 'opacity-50 cursor-not-allowed border border-gray-300 bg-white text-black md:w-12 min-w-8 md:h-8' 
                            : 'border border-gray-300 bg-white text-black md:w-12 min-w-8 md:h-8'}`}
                            onClick={removeQuantity}>
                            -
                        </div>
                        <p className="border border-gray-300 bg-white text-black md:w-12 min-w-8 md:h-8">
                            {inputQuantity}
                        </p>     
                        <div className="border border-gray-300 bg-white text-black md:w-12 min-w-8 md:h-8 hover:opacity-70"
                        onClick={addQuantity}>
                            +
                        </div>
                    </div>
                    <div className="flex-grow"></div>
                    <div className="relative mt-32">
                        <button className="bg-sky-700 hover:opacity-90 text-white px-12 py-4 rounded-md w-40 ml-auto absolute bottom-0 right-0">
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </UserModal>
    )
}
export default ProductQuantity;