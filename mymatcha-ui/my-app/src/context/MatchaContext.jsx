import React, {createContext, useContext, useEffect, useState} from 'react';
import {api} from '../services/api';
import {useAuth} from './AuthContext';

const MatchaContext = createContext();

export const MatchaProvider = ({children}) => {
    const {user} = useAuth();

    const [matchas, setMatchas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMatchas = async () => {
        try {
            setLoading(true);
            const data = await api.getMatchas();
            setMatchas(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchMatchas();
        }
    }, [user]);

    const addMatcha = async (matchaData) => {
        try {
            const response = await api.createMatcha(matchaData);
            setMatchas([response, ...matchas]);
            return {success: true};
        } catch (err) {
            console.error("Add matcha error:", err.message);
            return {success: false, error: err.message};
        }
    };


    const updateMatcha = async (id, matchaData) => {
        try {
            const updatedMatcha = await api.updateMatcha(id, matchaData);
            setMatchas(prevMatchas => prevMatchas.map(m =>
                m.id === id ? {...m, ...updatedMatcha[0]} : m
            ));
            return {success: true};
        } catch (err) {
            return {success: false, error: err.message};
        }
    };

    const deleteMatcha = async (id) => {
        try {
            await api.deleteMatcha(id);
            setMatchas(matchas.filter(m => m.id !== id));
            return {success: true};
        } catch (err) {
            return {success: false, error: err.message};
        }
    };

    return (
        <MatchaContext.Provider
            value={{
                matchas,
                loading,
                error,
                addMatcha,
                updateMatcha,
                deleteMatcha,
                refreshMatchas: fetchMatchas
            }}
        >
            {children}
        </MatchaContext.Provider>
    );
};

export const useMatcha = () => useContext(MatchaContext);