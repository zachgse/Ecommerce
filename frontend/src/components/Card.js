import { Link } from "react-router-dom";

function Card({children}) {
    return(
        <>
            <div className="bg-white border-solid border-2 border-gray rounded-lg shadow-lg min-w-64 min-h-64 max-w-auto flex flex-col">
                {children}
            </div>
        </>
    );
}

export default Card;