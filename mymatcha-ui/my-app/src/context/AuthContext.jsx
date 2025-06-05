import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.signIn(email, password);
            localStorage.setItem('token', response.access_token);
            localStorage.setItem('user', JSON.stringify(response.user));
            setUser(response.user);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: error.message || 'Login failed. Please check your credentials.'
            };
        }
    };

    const signup = async (email, password) => {
        try {
            const response = await api.signUp(email, password);
            localStorage.setItem('token', response.access_token);
            localStorage.setItem('user', JSON.stringify(response.user));
            setUser(response.user);
            return { success: true };
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            await api.signOut();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: error.message };
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);