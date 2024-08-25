import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const storedAuth = sessionStorage.getItem('auth');
        return storedAuth ? JSON.parse(storedAuth) : null;
    });

    useEffect(() => {
        if (auth) {
            sessionStorage.setItem('auth', JSON.stringify(auth));
        } else {
            sessionStorage.removeItem('auth');
        }
    }, [auth]);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
