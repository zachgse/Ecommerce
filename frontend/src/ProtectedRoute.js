import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from './api/AuthProvider';

function ProtectedRoute({ children, requiredRole }) {
    const { auth } = useContext(AuthContext);

    if (auth.type !== requiredRole) {
        return <Navigate to="/error" />;
    }

    return children;
}

export default ProtectedRoute;