import React, { createContext, useState, useEffect, useContext, Children } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user , setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, [])

    // Function to handle login
    const login = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // Function to handle logout
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');        
    };

    return (
        <AuthContext.Provider value={{user, token, login, logout, setUser, loading}}>
            {children}
        </AuthContext.Provider>
    )
}
//To be easy access from children 
export const useAuth = () => useContext(AuthContext);