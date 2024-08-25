import React, { useRef, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../../api/AuthProvider';
import Test from '../../../components/Test';
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdModeEdit, MdOutlineProductionQuantityLimits } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { SiSimpleanalytics } from "react-icons/si";
import { AiOutlineProduct } from "react-icons/ai";

const UserLayout = ({setActivePage,activePage,children}) => {
    const {auth} = useContext(AuthContext);
    const profileRef = useRef(null);
    const dashboardRef = useRef(null);
    const productRef = useRef(null);
    const orderRef = useRef(null);

    useEffect(() => {
        const handleClick = (page) => {
            setActivePage(page);
        }

        if (profileRef.current) {
            profileRef.current.addEventListener('click', () => handleClick('profile'));
        }
        if (dashboardRef.current) {
            dashboardRef.current.addEventListener('click', () => handleClick('dashboard'));
        }
        if (productRef.current) {
            productRef.current.addEventListener('click', () => handleClick('product'));
        }
        if (orderRef.current) {
            orderRef.current.addEventListener('click', () => handleClick('order'));
        }

        return () => {
            if (profileRef.current) {
                profileRef.current.removeEventListener('click', () => handleClick('profile'));
            }
            if (dashboardRef.current) {
                dashboardRef.current.removeEventListener('click', () => handleClick('dashboard'));
            }
            if (productRef.current) {
                productRef.current.removeEventListener('click', () => handleClick('product'));
            }
            if (orderRef.current) {
                orderRef.current.removeEventListener('click', () => handleClick('order'));
            }
        }
    }, [setActivePage]);

    return (
        <>
            <Test/>
            <section className="h-full mx-auto px-12 pb-32">
                <div className="flex md:flex-row flex-col justify-center gap-8 items-start w-full h-full mt-12">
                    <div className="md:w-52 w-full h-auto text-center">
                        <div className="flex justify-center items-center gap-4 py-2 ms-5">
                            <div>
                                <IoPersonCircleOutline className='text-sky-700 w-12 h-12 mt-3' />
                            </div>
                            <div className="text-left">
                                {auth.username}
                                <Link to="/user/profile/index" className="flex gap-1 text-gray-500 hover:cursor-pointer">
                                    <MdModeEdit className="mt-1"/> Edit Profile
                                </Link>
                            </div>
                        </div>
                        <div className="w-auto border border-1 border-gray-200"></div>
                        <div ref={profileRef} className="hover:cursor-pointer">
                            <div className="flex justify-center items-center py-2 gap-3">
                                <FaRegUser className="text-sky-700 w-5 h-5 ms-4"/>
                                <span><Link to="/user/profile/index">My Account</Link></span>
                            </div>
                            {activePage === 'profile' && (
                                <div className="flex flex-col items-center justify-center ms-4">
                                    <div className="text-left ms-8">
                                        <div><Link to="/user/profile/index" className="text-gray-500">Profile</Link></div>         
                                        <div><Link to="/user/profile/password" className="text-gray-500">Change<br/> Password</Link></div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {auth && auth.type === 'Admin' && (
                            <>
                                <div ref={dashboardRef} className="hover:cursor-pointer">
                                    <div className="flex justify-center items-center py-2 gap-3">
                                        <SiSimpleanalytics className="text-sky-700 w-5 h-5 ms-2"/>
                                        <span><Link to="/user/dashboard/index">Dashboard</Link></span>
                                    </div>
                                </div>
                                <div ref={productRef}>
                                    <div className="flex justify-center items-center py-2 gap-3">
                                        <AiOutlineProduct className="text-sky-700 w-5 h-5 "/>
                                        <span><Link to="/user/product/index">Products</Link></span>
                                    </div>
                                    {activePage === 'product' && (
                                        <div className="flex flex-col items-center justify-center ms-11">
                                            <div className="text-left">
                                                <div><Link to="/user/product/index" className="text-gray-500">Product</Link></div>
                                                <div><Link to="/user/category/index" className="text-gray-500">Category</Link></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                        <div ref={orderRef} className="hover:cursor-pointer">
                            <div className="flex justify-center items-center py-2 gap-3">
                                <MdOutlineProductionQuantityLimits className="-ms-3 text-sky-700 w-5 h-5"/>
                                <span><Link to="/user/order/index">Orders</Link></span>
                            </div>
                            {activePage === 'order' && (
                                <div className="flex flex-col items-center justify-center ms-6">
                                    <div className="text-left">
                                        <div><Link to="/user/order/index" className="text-gray-500">Order</Link></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg-white border-solid border-2 border-gray md:w-3/5 w-full h-full px-12 py-8">
                        {children}
                    </div>
                </div>
            </section>
        </>
    )
}

export default UserLayout;