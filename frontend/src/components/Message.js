import { useState,useEffect } from "react";
import { GoCheckCircle } from "react-icons/go";
import { RxCrossCircled } from "react-icons/rx";

const Message = (props) => {
    const [status,setStatus] = useState('');

    useEffect(() => {
        if (props) {
            setStatus(props.status);
        }
    },[props])

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center`}>
            <div className="bg-black bg-opacity-70  visible opacity-100 text-white p-6 w-96">
                {status && status == 'success' ? <GoCheckCircle className="text-green-500 h-16 w-16 m-auto"/>
                    : <RxCrossCircled className='text-red-500 h-16 w-16 m-auto'/>}
                <p className="text-center font-bold my-4">{props.message}</p>
            </div>
        </div>
    )
}

export default Message;

