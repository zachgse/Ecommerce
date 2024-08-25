import React, { useContext, useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import api from '../api/ApiLink';
import AuthContext from '../api/AuthProvider';
import { FaSpinner } from 'react-icons/fa';

const PaymentSuccess = () => {
    const {auth} = useContext(AuthContext)
    const navigate = useNavigate();

    useEffect(() =>{
        setTimeout(() => {
            navigate('/');
        }, 5000)
    }, []);

    // useEffect(() => {
    //     const handleSuccess = async () => {
    //         try {
    //             const response = await api.get('cart/success', {
    //                 headers: {
    //                     'Authorization': `Token ${auth.token}`
    //                 }
    //             });
    //             console.log(response.data);
    //             navigate("/")
    //         } catch (error) {
    //             console.error('There was an error!', error);
    //             // Handle error response, e.g., show error message
    //         }
    //     };

    //     handleSuccess();
    // }, [navigate]);

    return (
        <div className="flex justify-center items-center h-screen px-4 md:px-20">
            <div className="flex flex-col gap-10 md:gap-20 text-center border border-1 border-gray-200 w-full max-w-lg md:max-w-xl lg:max-w-2xl p-8 md:p-20">
                <p className="text-4xl md:text-7xl text-sky-700 font-bold tracking-wider uppercase">
                    E-COMMERCE
                </p>
                <FaSpinner className="m-auto animate-spin w-12 h-12 md:w-20 md:h-20 text-sky-700"/>
                <h1 className="text-base md:text-xl text-center">
                    Thank you for your purchase. <br/> Your payment is being processed and will be redirected shortly.
                </h1>
            </div>
        </div>
    );
};

export default PaymentSuccess;
