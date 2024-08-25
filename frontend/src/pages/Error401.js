import { Link } from "react-router-dom";
import Test from "../components/Test";

function Error401(){
    return(
        <>
            <Test/>
            <section className="h-screen flex flex-col justify-center items-center">
                <p className="font-bold text-7xl">ERROR 401</p><br/>
                <p className="text-2xl">You do not have an admin privileges.</p><br/>
                <Link to="/" className="bg-sky-700 hover:opacity-90 text-white px-4 py-2 rounded-md cursor-pointer">
                    Back to home
                </Link>
            </section>
        </>
      );
}

export default Error401;