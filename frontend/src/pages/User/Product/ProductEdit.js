import UserModal from "../Layouts/UserModal";
import Message from "../../../components/Message";
import { useEffect,useRef,useState } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoMdCloseCircleOutline } from "react-icons/io";
import api from "../../../api/ApiLink";

const ProductEdit = (props) => {
    const editRef = useRef(null);
    const [product,setProduct] = useState([]);
    const [categories,setCategories] = useState([]);
    const productId = props.productId;
    const [inputName,setInputName] = useState('');
    const [inputCategory,setInputCategory] = useState('')
    const [inputDescription,setInputDescription] = useState('')
    const [inputPrice,setInputPrice] = useState(1)
    const [inputImage,setInputImage] = useState('')
    const [status,setStatus] = useState('');
    const [message,setMessage] = useState('');

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (editRef.current && !editRef.current.contains(e.target)) {
                props.closeEditModal();
            }
        }

        document.addEventListener('mousedown',handleClickOutside);

        return () => {
            document.removeEventListener('mousedown',handleClickOutside);
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

            const fetchCategories = async () => {
                try {
                    const response = await api.get('category/');
                    setCategories(response.data.categories);
                } catch (error) {
                    console.error("Error message:",error);
                }
            }

            fetchProduct(productId);
            fetchCategories();
        }
    },[productId])

    useEffect(() => {
        if (product) {
            setInputName(product.name || '');
            setInputCategory(product.category || '');
            setInputDescription(product.description || '');
            setInputPrice(product.price || '');
        }
    }, [product]);

    const handleFormSubmit = async(e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('id',productId);
        formData.append('name',inputName);
        formData.append('category',inputCategory);
        formData.append('description',inputDescription);
        formData.append('price',inputPrice);
        if (inputImage){
            formData.append('image',inputImage);
        }

        try {
            const response = await api.put('test/product/update_info',formData);
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
            console.error("Error message: ",error);
        }
    }

    return(
        <UserModal>
            {status && (
                <Message status={status} message={message}/>
            )}
            <div ref={editRef}>
                <IoMdCloseCircleOutline onClick={props.closeEditModal} className='text-gray-500 h-6 w-6 ml-auto cursor-pointer mb-5'/>
                <p className="text-2xl font-bold">Edit Product</p>
                <div className="w-auto border border-1 border-gray-200 my-4"></div>
                <form onSubmit={handleFormSubmit} encType="multipart/form-data">
                    <div className="flex md:flex-wrap flex-wrap-reverse justify-center items-center gap-8">
                        <div className="md:flex-auto flex-none">
                            <div className="mb-4">
                                <label className="font-semibold my-3 ms-1">Product Name</label>
                                <input type="text" name="name" value={inputName} onChange={(e)=> setInputName(e.target.value)}
                                    className="border-solid border border-e1e1e1 rounded-md w-full h-12 p-4"/>
                            </div>
                            <div className="mb-4">
                                <label className="font-semibold my-3 ms-1">Product Category</label>
                                <select name="category" value={inputCategory}
                                    onChange={(e) => setInputCategory(e.target.value)}
                                    className="border-solid border border-e1e1e1 rounded-md w-full h-12 text-center"
                                    required>
                                    <option value="" hidden selected>Product Category</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="font-semibold my-3 ms-1">Product Description</label>
                                <textarea name="description" value={inputDescription} onChange={(e) => setInputDescription(e.target.value)}
                                    className="border-solid border border-e1e1e1 rounded-md w-full h-32 p-4"/>
                            </div>
                            <div className="mb-4">
                                <label className="font-semibold my-3 ms-1">Product Price</label>
                                <input type="text" name="name" value={inputPrice} onChange={(e) => setInputPrice(e.target.value)}
                                    className="border-solid border border-e1e1e1 rounded-md w-full h-12 p-4"/>
                            </div>
                            <div className="mb-4">
                                <label className="font-semibold my-3 ms-1 me-2">Product Quantity:</label>
                                {product.quantity} pcs
                            </div>
                        </div>
                        <div className="flex flex-col flex-none justify-center items-center">
                            {product.image ? <img src={`http://127.0.0.1:8000/${product.image}`} className='w-32' alt={product.name} />
                            : <IoPersonCircleOutline className='text-sky-700 w-32 h-32' />}
                            <input type="file" name="image" onChange={(e) => setInputImage(e.target.files[0])}/>
                            <p className="text-gray-500 mt-2">File size: maximum 1 MB</p>
                            <p className="text-gray-500">File extension: .JPEG, .PNG</p> 
                            <p className="font-bold">Current Image</p>          
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

export default ProductEdit;