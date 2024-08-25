import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import {ToastContainer,toast} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"; 
import api from "../api/ApiLink";
import { FaSpinner } from 'react-icons/fa';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";

function Register() {
    const [inputFirstName,setInputFirstName] = useState('');
    const [inputLastName,setInputLastName] = useState('');
    const [inputAddress,setInputAddress] = useState('');
    const [inputEmail,setInputEmail] = useState('');
    const [inputUsername,setInputUsername] = useState('');
    const [inputPassword,setInputPassword] = useState('');
    const [inputConfirmPassword,setInputConfirmPassword] = useState('');
    const [showPassword,setShowPassword] = useState(false);
    const [showConfirmPassword,setShowConfirmPassword] = useState(false);
    const [loading,isLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        isLoading(true);
        toast.warn("Registration in process...", {
            position: "top-center",
            hideProgressBar: true,
            theme: "colored",
            pauseOnHover: false,
            closeOnClick: true,
            autoClose: 1000,
        });
        setTimeout(async () => {
            const formData = new FormData;
            formData.append('first_name',inputFirstName);
            formData.append('last_name',inputLastName);
            formData.append('address',inputAddress);
            formData.append('email',inputEmail);
            formData.append('username',inputUsername);
            formData.append('password',inputPassword);
            formData.append('confirm_password',inputConfirmPassword);
            try {
                const response = await api.post('user/register',formData);
                setInputFirstName('');
                setInputLastName('');
                setInputAddress('');
                setInputEmail('');
                setInputUsername('');
                setInputPassword('');
                setInputConfirmPassword('');
                toast.success("Registration successful! Redirecting to login...", {
                    position: "top-center",
                    hideProgressBar: true,
                    theme: "colored",
                    pauseOnHover: false,
                    closeOnClick: true,
                    autoClose: 1500,
                });
                setTimeout(() => {
                    navigate('/login');
                },1500) 
            } catch (error){
                setInputFirstName('');
                setInputLastName('');
                setInputAddress('');
                setInputEmail('');
                setInputUsername('');
                setInputPassword('');
                setInputConfirmPassword('');
                toast.error("Registration unsuccessful.", {
                    position: "top-center",
                    hideProgressBar: true,
                    theme: "colored",
                    pauseOnHover: false,
                    closeOnClick: true,
                    autoClose: 1500,
                });
            } finally {
                isLoading(false);
            }
        }, 2000)
    }

    return (
        <>
            <ToastContainer/>
            <div className="h-full flex">
                <div className="flex flex-1 justify-center items-center bg-sky-700 min-h-screen max-h-auto md:flex md:justify-center md:items-center hidden md:block">
                    <Link to="/" className="text-5xl text-white text-uppercase font-bold tracking-wider uppercase">E-commerce</Link>
                </div>
                <div className="flex flex-1 flex-col justify-center items-center my-10">
                    <div className="flex flex-col place-content-evenly bg-white border-solid border-2 border-gray rounded-lg shadow-lg w-4/5 min-h-4/5 max-h-auto p-12">
                        <div>
                        <Link to="/" className="text-sky-700 text-5xl uppercase font-bold tracking-widest text-center mb-4 block md:hidden">E-commerce</Link>
                            <p className="text-4xl uppercase font-bold tracking-widest text-center mt-4 mb-20">Register</p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-y-2 mb-4">
                                <label className="font-medium">First Name</label>
                                <input type="text" value={inputFirstName} placeholder="Enter your first name..."
                                    onChange={(e) => setInputFirstName(e.target.value)}
                                    className="border border-solid border-e1e1e1 rounded-md w-full h-12 p-4"/>
                            </div>
                            <div className="grid grid-cols-1 gap-y-2 mb-4">
                                <label className="font-medium">Last Name</label>
                                <input type="text" value={inputLastName} placeholder="Enter your last name..."
                                    onChange={(e) => setInputLastName(e.target.value)}
                                    className="border border-solid border-e1e1e1 rounded-md w-full h-12 p-4"/>
                            </div>
                            <div className="grid grid-cols-1 gap-y-2 mb-4">
                                <label className="font-medium">Address</label>
                                <textarea type="text" value={inputAddress} placeholder="Enter your address..."
                                    onChange={(e) => setInputAddress(e.target.value)}
                                    className="border border-solid border-e1e1e1 rounded-md w-full h-32 p-4" />
                            </div>
                            <div className="grid grid-cols-1 gap-y-2 mb-4">
                                <label className="font-medium">Email</label>
                                <input type="email" value={inputEmail} placeholder="Enter your email..."
                                    onChange={(e) => setInputEmail(e.target.value)}
                                    className="border border-solid border-e1e1e1 rounded-md w-full h-12 p-4"/>
                            </div>
                            <div className="grid grid-cols-1 gap-y-2 mb-4">
                                <label className="font-medium">Username</label>
                                <input type="text" value={inputUsername} placeholder="Enter your username..."
                                    onChange={(e) => setInputUsername(e.target.value)}
                                    className="border border-solid border-e1e1e1 rounded-md w-full h-12 p-4"/>
                            </div>
                            <div className="grid grid-cols-1 gap-y-2 mb-4 relative">
                                <label className="font-medium">Password</label>
                                <input type={showPassword ? 'text' : 'password'} value={inputPassword} placeholder="Enter your password..."
                                    onChange={(e) => setInputPassword(e.target.value)}
                                    className="border border-solid border-e1e1e1 rounded-md w-full h-12 p-4 pr-12"/>
                                <span onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center  cursor-pointer text-gray-500 mt-7">
                                    {showPassword ? <FaEyeSlash/> : <FaEye/>}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 gap-y-2 mb-4 relative">
                                <label className="font-medium">Confirm Password</label>
                                <input type={showConfirmPassword ? 'text' : 'password'} value={inputConfirmPassword} placeholder="Enter your password confirmation..."
                                    onChange={(e) => setInputConfirmPassword(e.target.value)}
                                    className="border border-solid border-e1e1e1 rounded-md w-full h-12 p-4 pr-12"/>
                                <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center  cursor-pointer text-gray-500 mt-7">
                                    {showConfirmPassword ? <FaEyeSlash/> : <FaEye/>}
                                </span>
                            </div>
                            <p className="mt-8">
                                Already have an account? Click{' '}
                                <Link to="/login" className="text-sky-700 underline hover:opacity-75">
                                    here
                                </Link>{' '}
                                to login.
                            </p>
                            <div className="flex justify-end mt-8">
                                <button type="submit" disabled={loading}
                                    className={`bg-sky-700 hover:opacity-90 rounded-md flex items-center justify-center text-white w-32 h-12
                                                ${loading ? 'bg-sky-300 cursor-not-allowed' : ''}`}>
                                    {loading && <FaSpinner className="animate-spin mr-3" />} Register
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Register;
