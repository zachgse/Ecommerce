import UserLayout from "../Layouts/UserLayout";
import Message from "../../../components/Message";
import { useState,useEffect } from "react";
import api from "../../../api/ApiLink";

function CategoryAdd(){
    const [activePage, setActivePage] = useState('product');
    const [inputName,setInputName] = useState('')
    const [status,setStatus] = useState('');
    const [message,setMessage] = useState('');

    const validationName = () => {
        if (inputName.length >= 1 && inputName.length < 10){
            return true;
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (validationName()){
            return;
        }

        const formData = new FormData();
        formData.append('name', inputName);

        try {
            const response = await api.post('category/add',formData);
            setStatus("success");
            setMessage('Category has been added.');
        } catch (error) {
            setStatus('failed');
            if (error.response.status == 400) {             
                setMessage("Bad Request");
            } else if (error.response.status == 400) {
                setMessage("Please log in before adding new category");
            } else {
                setMessage("System Error. Please again later");
            }
        } finally {
            setInputName("");   
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
                <p className="text-2xl font-bold my-5">Add Category</p>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="flex md:flex-wrap flex-wrap-reverse justify-center items-center md:gap-28">
                        <div className="md:flex-auto flex-none">
                            <div className="mb-4">
                                <label className="font-semibold my-3 ms-1">Name</label>
                                <input type="text" name="name" value={inputName} placeholder="Enter Category Name"
                                    onChange={(e) => setInputName(e.target.value)}
                                    className={`border-solid border border-e1e1e1 rounded-md w-full h-12 p-4 
                                    ${validationName() ? 'border-red-500' : ''}`} 
                                    required/>
                                {validationName() && (
                                    <div className="text-red-500 ms-1 mt-1 text-xs">Category Name must be atleast 10 characters</div>
                                )}
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="bg-sky-700 hover:opacity-90 rounded-md float-right text-white w-32 h-12 my-8">Add</button>
                </form>
            </UserLayout>
        </>
    );
}

export default CategoryAdd;