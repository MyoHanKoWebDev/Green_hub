import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios from '../../api/axios';

// 1. Define the Shape of your Admin User
interface AdminUser {
    id: number;
    adName: string;
    adEmail: string;
    adImage: string;
    addDate: string;
}

// 2. Define the Shape of the Context Value
interface AuthContextType {
    user: AdminUser | null;
    token: string | null;
    login: (userData: AdminUser, userToken: string) => void;
    logout: () => void;
    setUser: React.Dispatch<React.SetStateAction<AdminUser | null>>;
}

// 3. Create the Context with an initial undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AdminUser | null>(null);
    const [token, setToken] = useState<string | null>(sessionStorage.getItem('token'));

    useEffect(() => {
        const savedUser = sessionStorage.getItem('user');
        if (savedUser && token) {
            setUser(JSON.parse(savedUser));
            // Set the global Authorization header for Axios
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, [token]);

    const login = (userData: AdminUser, userToken: string) => {
        setUser(userData);
        setToken(userToken);
        
        // Use sessionStorage so data clears when the tab is closed
        sessionStorage.setItem('token', userToken);
        sessionStorage.setItem('user', JSON.stringify(userData));
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// 4. Custom hook with Type Safety check
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};