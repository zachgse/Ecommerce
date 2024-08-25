import { useState,Suspense, useContext,useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/ApiLink";
import { createResource,fetchEditProfile } from "../../../api/FetchData";
import AuthContext from "../../../api/AuthProvider";
import UserLayout from "../Layouts/UserLayout";
import Message from "../../../components/Message";

function ProfileSkeleton() {
    return (
        <>
            <div className="bg-gray-200 rounded-md h-12 w-full mb-8"/>
            <div className="bg-gray-200 rounded-md h-12 w-full mb-8"/>
            <div className="bg-gray-200 rounded-md h-12 w-full mb-8"/>
            <div className="bg-gray-200 rounded-md h-12 w-1/5 float-right"/>
        </>
    )
}

function ProfileInfo({userResource,auth,setAuth,setStatus,setMessage}) {
    const profile = userResource.read();
    const [inputUsername,setInputUsername] = useState('');
    const [inputFirstname,setInputFirstname] = useState('');
    const [inputLastname,setInputLastname] = useState('');
    const [inputEmail,setInputEmail] = useState('');
    const [inputAddress,setInputAddress] = useState('');

    useEffect(() => {
        if (profile) {
            setInputUsername(profile.username || '');
            setInputFirstname(profile.first_name || '');
            setInputLastname(profile.last_name || '');
            setInputEmail(profile.email || '');
            setInputAddress(profile.address || '');
        }
    },[profile]);

    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('username',inputUsername);
            formData.append('first_name',inputFirstname);
            formData.append('last_name',inputLastname);
            formData.append('email',inputEmail);
            formData.append('address',inputAddress);
            const response = await api.post('user/profile_update',formData,{
                headers:{
                    'Authorization': `Token ${auth.token}`
                }
            });
            setAuth((prevAuth) => ({
                ...prevAuth,
                username: inputUsername, 
            }));
            setStatus('success');
            setMessage('Profile has been updated.');
        } catch (error) {
            console.error(error);
            setStatus('failed');
            setMessage('Profile has not been updated.');
        } finally {
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
                        <div className="mb-4">
                            <label className="font-semibold my-3 ms-1">First Name</label>
                            <input type="text" value={inputFirstname} onChange={(e) => setInputFirstname(e.target.value)}
                                className="border-solid border border-e1e1e1 rounded-md w-full h-12 p-4"/>
                        </div>
                        <div className="mb-4">
                            <label className="font-semibold my-3 ms-1">Last Name</label>
                            <input type="text" value={inputLastname} onChange={(e) => setInputLastname(e.target.value)}
                                className="border-solid border border-e1e1e1 rounded-md w-full h-12 p-4"/>
                        </div>
                        <div className="mb-4">
                            <label className="font-semibold my-3 ms-1">Username</label>
                            <input type="text" value={inputUsername} onChange={(e) => setInputUsername(e.target.value)}
                                className="border-solid border border-e1e1e1 rounded-md w-full h-12 p-4"/>
                        </div>
                        <div className="mb-4">
                            <label className="font-semibold my-3 ms-1">Email</label>
                            <input type="text" value={inputEmail} onChange={(e) => setInputEmail(e.target.value)}
                                className="border-solid border border-e1e1e1 rounded-md w-full h-12 p-4"/>
                        </div>
                        <div className="mb-4">
                            <label className="font-semibold my-3 ms-1">Address</label>
                            <textarea value={inputAddress} onChange={(e) => setInputAddress(e.target.value)}
                                className="border-solid border border-e1e1e1 rounded-md w-full h-32 p-4"/>
                        </div>
                    </div>
                </div>
                <div className="flex my-8">
                    <Link to="/user/profile/password" className="flex justify-center items-center bg-sky-700 hover:opacity-90 rounded-md float-right text-white w-40 h-12 me-auto cursor-pointer">
                        Change Password
                    </Link>
                    <button type="submit" className="bg-sky-700 hover:opacity-90 rounded-md float-right text-white w-32 h-12">Save</button>
                </div>
                
            </form>
        </>
    )
}

function ProfileIndex() {
    const [activePage, setActivePage] = useState('profile');
    const {auth,setAuth} = useContext(AuthContext);
    const userResource = createResource(fetchEditProfile(auth.token));
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');

    return (
        <UserLayout setActivePage={setActivePage} activePage={activePage}>
            {status && (
                <Message status={status} message={message}/>
            )}
            <p className="text-2xl font-bold my-5">My Profile</p>
            <Suspense fallback={<ProfileSkeleton/>}>
                <ProfileInfo userResource={userResource} auth={auth} setAuth={setAuth} setStatus={setStatus} setMessage={setMessage}/>
            </Suspense>
        </UserLayout>
    )
}

export default ProfileIndex;


