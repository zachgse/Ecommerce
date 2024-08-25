import UserModal from "../Layouts/UserModal";
import Message from "../../../components/Message";
import { useEffect,useRef,useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import api from "../../../api/ApiLink";

const CategoryEdit = (props) => {
    const editRef = useRef(null);
    const [category,setCategory] = useState([]);
    const categoryId = props.categoryId;
    const [inputName,setInputName] = useState('');
    const [status,setStatus] = useState('');
    const [message,setMessage] = useState('');

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (editRef.current && !editRef.current.contains(e.target)) {
                props.closeModal();
            }
        }

        document.addEventListener('mousedown',handleClickOutside);

        return () => {
            document.removeEventListener('mousedown',handleClickOutside);
        }
    },[props]);

    useEffect(()=>{
        if (categoryId) {
            const fetchCategory = async(categoryId) => {
                try {
                    const response = await api.get(`category/${categoryId}`);
                    setCategory(response.data.category);
                } catch (error) {
                    console.error("Error message:",error);
                }
            }

            fetchCategory(categoryId);
        }
    },[categoryId])

    useEffect(() => {
        if (category) {
            setInputName(category.name || '');
        }
    }, [category]);

    const handleFormSubmit = async(e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('id',categoryId);
        formData.append('name',inputName);

        try {
            const response = await api.put('category/update',formData);
            setStatus('success');
            setMessage('Category has been updated.');
            setTimeout(() => {
                setStatus('');
                setMessage('');
            },1000);
        } catch (error) {
            setStatus('failed');
            setMessage('Category has not been updated.');
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
                <IoMdCloseCircleOutline onClick={props.closeModal} className='text-gray-500 h-6 w-6 ml-auto cursor-pointer mb-5'/>
                <p className="text-2xl font-bold">Edit Category</p>
                <div className="w-auto border border-1 border-gray-200 my-4"></div>
                <form onSubmit={handleFormSubmit} encType="multipart/form-data">
                    <div className="flex md:flex-wrap flex-wrap-reverse justify-center items-center gap-8">
                        <div className="md:flex-auto flex-none">
                            <div className="mb-4">
                                <label className="font-semibold my-3 ms-1">Category Name</label>
                                <input type="text" name="name" value={inputName} onChange={(e)=> setInputName(e.target.value)}
                                    className="border-solid border border-e1e1e1 rounded-md w-full h-12 p-4"/>
                            </div>
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

export default CategoryEdit;