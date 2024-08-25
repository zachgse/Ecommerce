import { useState,Suspense, useContext } from "react";
import api from "../../../api/ApiLink";
import AuthContext from "../../../api/AuthProvider";
import UserLayout from "../Layouts/UserLayout";
import Message from "../../../components/Message";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";

function PasswordSkeleton() {
    return (
        <>
            <div className="bg-gray-200 rounded-md h-12 w-full mb-8"/>
            <div className="bg-gray-200 rounded-md h-12 w-full mb-8"/>
            <div className="bg-gray-200 rounded-md h-12 w-full mb-8"/>
            <div className="bg-gray-200 rounded-md h-12 w-1/5 float-right"/>
        </>
    )
}

function PasswordInfo({auth,setStatus,setMessage}) {
    const [inputOldPassword,setInputOldPassword] = useState('');
    const [inputNewPassword,setInputNewPassword] = useState('');
    const [inputConfirmPassword,setInputConfirmPassword] = useState('');
    const [showOldPassword,setShowOldPassword] = useState(false);
    const [showNewPassword,setShowNewPassword] = useState(false);
    const [showConfirmPassword,setShowConfirmPassword] = useState(false);

    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('old_password',inputOldPassword);
            formData.append('new_password',inputNewPassword);
            formData.append('confirm_password',inputConfirmPassword);
            const response = await api.post('user/change_password',formData,{
                headers:{
                    'Authorization': `Token ${auth.token}`
                }
            });
            setStatus('success');
            setMessage('Password has been changed.');
        } catch (error) {
            console.error(error);
            setStatus('failed');
            setMessage('Password has not been changed.');
        } finally {
            setInputOldPassword('');
            setInputNewPassword('');
            setInputConfirmPassword('');
            setShowOldPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);
            setTimeout(() => {
                setStatus('');
                setMessage('');
            },2000);
        }
    }

    return (
        <>
            <form encType="multipart/form-data" onSubmit={handleSubmit}>
                <div className="flex md:flex-wrap flex-wrap-reverse justify-center items-center md:gap-28">
                    <div className="md:flex-auto flex-none">
                        <div className="grid grid-cols-1 gap-y-2 mb-4 relative">
                            <label className="font-medium">Old Password</label>
                            <input type={showOldPassword ? 'text' : 'password'} value={inputOldPassword}
                                onChange={(e) => setInputOldPassword(e.target.value)}
                                className="border border-solid border-e1e1e1 rounded-md w-full h-12 p-4 pr-12"/>
                            <span onClick={() => setShowOldPassword(!showOldPassword)}
                                className="absolute inset-y-0 right-3 flex items-center  cursor-pointer text-gray-500 mt-7">
                                {showOldPassword ? <FaEyeSlash/> : <FaEye/>}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 gap-y-2 mb-4 relative">
                            <label className="font-medium">New Password</label>
                            <input type={showNewPassword ? 'text' : 'password'} value={inputNewPassword}
                                onChange={(e) => setInputNewPassword(e.target.value)}
                                className="border border-solid border-e1e1e1 rounded-md w-full h-12 p-4 pr-12"/>
                            <span onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute inset-y-0 right-3 flex items-center  cursor-pointer text-gray-500 mt-7">
                                {showNewPassword ? <FaEyeSlash/> : <FaEye/>}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 gap-y-2 mb-4 relative">
                            <label className="font-medium">Confirm Password</label>
                            <input type={showConfirmPassword ? 'text' : 'password'} value={inputConfirmPassword}
                                onChange={(e) => setInputConfirmPassword(e.target.value)}
                                className="border border-solid border-e1e1e1 rounded-md w-full h-12 p-4 pr-12"/>
                            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-3 flex items-center  cursor-pointer text-gray-500 mt-7">
                                {showConfirmPassword ? <FaEyeSlash/> : <FaEye/>}
                            </span>
                        </div>
                    </div>
                </div>
                <button type="submit" className="bg-sky-700 hover:opacity-90 rounded-md float-right text-white w-32 h-12 my-8">Update</button>
            </form>
        </>
    )
}

function ProfilePassword() {
    const [activePage, setActivePage] = useState('profile');
    const {auth} = useContext(AuthContext);
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');

    return (
        <UserLayout setActivePage={setActivePage} activePage={activePage}>
            {status && (
                <Message status={status} message={message}/>
            )}
            <p className="text-2xl font-bold my-5">Change Password</p>
            <Suspense fallback={<PasswordSkeleton/>}>
                <PasswordInfo auth={auth} setStatus={setStatus} setMessage={setMessage}/>
            </Suspense>
        </UserLayout>
    )
}

export default ProfilePassword;


