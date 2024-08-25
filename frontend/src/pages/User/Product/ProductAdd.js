import UserLayout from "../Layouts/UserLayout";
import Message from "../../../components/Message";
import { useState,useEffect } from "react";
import api from "../../../api/ApiLink";
import { IoPersonCircleOutline } from "react-icons/io5";

function ProductAdd(){
    const [activePage, setActivePage] = useState('product');
    const [categories,setCategories] = useState([])
    const [inputName,setInputName] = useState('')
    const [inputCategory,setInputCategory] = useState('')
    const [inputDescription,setInputDescription] = useState('')
    const [inputPrice,setInputPrice] = useState(1)
    const [inputQuantity,setInputQuantity] = useState(1)
    const [inputImage,setInputImage] = useState('')
    const [status,setStatus] = useState('');
    const [message,setMessage] = useState('');

    const validationName = () => {
        if (inputName.length >= 1 && inputName.length < 10){
            return true;
        }
    }

    const validationCategory = () => {
        if (categories.includes(inputCategory)){
            return true;
        }
    }

    const validationDescription = () => {
        if (inputDescription.length >= 1 && inputDescription.length < 30) {
            return true;
        }
    }

    const validationPrice = () => {
        if (inputPrice <= 0) {
            return true;
        }
    }

    const validationQuantity = () => {
        if (inputQuantity <= 0) {
            return true;
        }
    }

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('category/');
                setCategories(response.data.categories);
            } catch (error) {
                console.error("Error message:",error);
            }
        }

        fetchCategories();
    }, [])

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (validationName() || validationCategory() || validationDescription() || validationPrice() || validationQuantity()){
            return;
        }

        const formData = new FormData();
        formData.append('name', inputName);
        formData.append('category', inputCategory);
        formData.append('description', inputDescription);
        formData.append('price', inputPrice);
        formData.append('quantity', inputQuantity);
        formData.append('image', inputImage);
 
        try {
            const response = await api.post('test/product/add',formData);
            setStatus("success");
            setMessage('Product has been added.');
        } catch (error) {
            setStatus('failed');
            if (error.response.status == 400) {             
                setMessage("Bad Request");
            } else if (error.response.status == 400) {
                setMessage("Please log in before adding new products");
            } else {
                setMessage("System Error. Please again later");
            }
        } finally {
            setInputName("");
            setInputCategory("");
            setInputDescription("");
            setInputPrice(1);
            setInputQuantity(1);
            setInputImage(null);
            setTimeout(() => {
                setStatus('');
                setMessage('');
            },1000);
        }
    }
    
    return(
        <>
            <UserLayout setActivePage={setActivePage} activePage={activePage}>
                {status && (
                    <Message status={status} message={message}/>
                )}
                <p className="text-2xl font-bold my-5">Add Product</p>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="flex md:flex-wrap flex-wrap-reverse justify-center items-center md:gap-28">
                        <div className="md:flex-auto flex-none">
                            <div className="mb-4">
                                <label className="font-semibold my-3 ms-1">Name</label>
                                <input type="text" name="name" value={inputName} placeholder="Enter Product Name"
                                    onChange={(e) => setInputName(e.target.value)}
                                    className={`border-solid border border-e1e1e1 rounded-md w-full h-12 p-4 
                                    ${validationName() ? 'border-red-500' : ''}`} 
                                    required/>
                                {validationName() && (
                                    <div className="text-red-500 ms-1 mt-1 text-xs">Product Name must be atleast 10 characters</div>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="font-semibold my-3 ms-1">Category</label>
                                <select name="category" value={inputCategory}
                                    onChange={(e) => setInputCategory(e.target.value)}
                                    className={`border-solid border border-e1e1e1 rounded-md w-full h-12 text-center
                                    ${validationCategory() ? 'border-red-500' : ''}`}
                                    required>
                                    <option value="" hidden selected>--SELECT CATEGORY--</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                                {validationCategory() && (
                                    <div className="text-red-500 ms-1 mt-1 text-xs">Selected category is not in the list</div>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="font-semibold my-3 ms-1">Description</label>
                                <textarea type="text" name="description" value={inputDescription} placeholder="Enter Product Description"
                                    onChange={(e) => setInputDescription(e.target.value)}
                                    className={`border-solid border border-e1e1e1 rounded-md w-full h-32 p-4
                                    ${validationDescription() ? 'border-red-500' : ''}`}
                                    required/>
                                {validationDescription() && (
                                    <div className="text-xs text-red-500 ms-1 mt-1">Product Description must be atleast 30 characters</div>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="font-semibold my-3 ms-1">Price</label>
                                <input type="number" name="price" value={inputPrice}
                                    onChange={(e) => setInputPrice(e.target.value)}
                                    className={`border-solid border border-e1e1e1 rounded-md w-full h-12 p-4
                                    ${validationPrice() ? 'border-red-500' : ''}`}
                                    required/>
                                {validationPrice() && (
                                    <div className="text-xs text-red-500 ms-1 mt-1">Product Price must be atleast 1 peso above</div>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="font-semibold my-3 ms-1">Quantity</label>
                                <input type="number" name="quantity" value={inputQuantity}
                                    onChange={(e) => setInputQuantity(e.target.value)}
                                    className={`border-solid border border-e1e1e1 rounded-md w-full h-12 p-4
                                    ${validationQuantity() ? 'border-red-500' : ''}`}
                                    required/>
                                {validationQuantity() && (
                                    <div className="text-xs text-red-500 ms-1 mt-1">Product Quantity must be atleast 1 and above</div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col flex-none justify-center items-center">
                            <IoPersonCircleOutline className='text-sky-700 w-32 h-32' />
                            <input type="file" name="image" onChange={(e) => setInputImage(e.target.files[0])} required/>
                            <p className="text-gray-500 mt-2">File size: maximum 1 MB</p>
                            <p className="text-gray-500">File extension: .JPEG, .PNG</p> 
                            <p className="font-bold">Image</p>          
                        </div>
                    </div>
                    <button type="submit" className="bg-sky-700 hover:opacity-90 rounded-md float-right text-white w-32 h-12 my-8">Add</button>
                </form>
            </UserLayout>
        </>
    );
}

export default ProductAdd;