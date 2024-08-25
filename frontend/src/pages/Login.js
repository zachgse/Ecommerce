import { Link, useNavigate } from "react-router-dom";
import { useState,useRef,useContext } from "react";
import api from "../api/ApiLink";
import AuthContext from "../api/AuthProvider";
import {ToastContainer,toast} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"; 
import { FaSpinner } from 'react-icons/fa';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";

function Login() {
    const {auth,setAuth} = useContext(AuthContext);
    const [username,setUsername] = useState('');
    const  inputUsername = useRef(null);
    const [password,setPassword] = useState('');
    const [showPassword,setShowPassword] = useState(false);
    const [error,isError] = useState(false);
    const [loading,isLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        isLoading(true);
        toast.warn("Logging in...", {
            position: "top-center",
            hideProgressBar: true,
            theme: "colored",
            pauseOnHover: false,
            closeOnClick: true,
            autoClose: 1000,
        });
        setTimeout(async () => {
            const formData = new FormData();
            formData.append('username',username);
            formData.append('password',password);
            try {
                const response = await api.post('user/login', formData);
                const token = response?.data?.token;
                const type = response?.data?.admin == false ? 'Customer' : 'Admin';
                setAuth({ username, token, type });
                toast.success("Login successful! Redirecting...", {
                    position: "top-center",
                    hideProgressBar: true,
                    theme: "colored",
                    pauseOnHover: false,
                    closeOnClick: true,
                    autoClose: 1500,
                });
                setTimeout(() => {
                    navigate('/');
                },1500)     
            } catch (error) {
                isError(true);
                setUsername('');
                setPassword('');
                inputUsername.current.focus();
                if (error.response.status === 400 || error.response.status === 401) {
                    toast.error("Incorrect credentials", {
                        position: "top-center",
                        hideProgressBar: true,
                        theme: "colored",
                        pauseOnHover: false,
                        closeOnClick: true,
                        autoClose: 1500,
                    });
                } else {
                    toast.warn("Server Error", {
                        position: "top-center",
                        hideProgressBar: true,
                        theme: "colored",
                        pauseOnHover: false,
                        closeOnClick: true,
                        autoClose: 1500,
                    });
                }
            } finally {
                isLoading(false);
            }
        }, 2000);
    }

    return(
    <>
        <ToastContainer/>
        <div className="h-full flex">
            <div className="flex flex-1 justify-center items-center bg-sky-700 h-screen md:flex md:justify-center md:items-center hidden md:block">
                <Link to="/" className="text-5xl text-white text-uppercase font-bold tracking-wider uppercase">E-commerce</Link>
            </div>
            <div className="flex flex-1 flex-col justify-center items-center mt-10 md:mt-0">
                <div className="flex flex-col place-content-evenly bg-white border-solid border-2 border-gray rounded-lg shadow-lg w-4/5 min-h-4/5 max-h-auto p-12">
                    <div>
                        <Link to="/" className="text-sky-700 text-5xl uppercase font-bold tracking-widest text-center mb-4 block md:hidden">E-commerce</Link>
                        <p className="text-4xl uppercase font-bold tracking-widest text-center mt-4 mb-20">Login</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        {error && <div className="text-red-500 text-center font-bold mb-5">Incorrect credentials</div>} 
                        <div>
                            <div className="grid grid-cols-1 gap-y-2 mb-4">
                                <label className="font-medium">Username</label>
                                <input type="text" name="username" value={username} ref={inputUsername} onChange={(e)=>setUsername(e.target.value)}
                                    className={`border-solid border border-e1e1e1 rounded-md w-full h-12 p-4
                                                ${error ? 'border-red-500': ''}`}
                                    placeholder="Enter your username..."
                                    required/>
                            </div>
                            {/* <div className="flex flex-row mb-4">
                                <label className="mt-3 me-1">Password</label>
                                <input type="password" name="password" value={password} onChange={(e)=>setPassword(e.target.value)}
                                    className={`border-solid border border-e1e1e1 rounded-md w-full h-12 p-4 ms-12
                                        ${error ? 'border-red-500': ''}`}
                                    placeholder="Enter your password..."/>
                            </div> */}
                            <div className="grid grid-cols-1 gap-y-2 mb-4 relative">
                                <label className="font-medium">Password</label>
                                <input type={showPassword ? 'text' : 'password'} value={password} placeholder="Enter your password..."
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`border-solid border border-e1e1e1 rounded-md w-full h-12 p-4
                                        ${error ? 'border-red-500': ''}`}/>
                                <span onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center  cursor-pointer text-gray-500 mt-7">
                                    {showPassword ? <FaEyeSlash/> : <FaEye/>}
                                </span>
                            </div>
                            <p className="mt-8">Doesn't have an account yet? Click <Link to="/register" className="text-sky-700 underline hover:opacity-75">here</Link> to register.</p>
                        </div>
                        <div>
                            <button type="submit" 
                                className={`bg-sky-700 hover:opacity-90 rounded-md float-right flex items-center justify-center text-white w-32 h-12 mt-40
                                            ${loading ? 'bg-sky-300 cursor-not-allowed' :''} `} disabled={loading}> 
                                {loading && <FaSpinner className="animate-spin mr-3"/>} Login
                            </button>
                        </div> 
                    </form>
                </div>
            </div>
        </div>
    </>
    );
}

export default Login;