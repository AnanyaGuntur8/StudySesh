import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'

const AuthContext = createContext();

// Provider
const AuthProvider = ({ children }) => {
    const [state, setState] = useState({
        user: null,
        token: "",
    });

    axios.defaults.baseURL = 'http://192.168.1.105:8080/api/v1'

    // Initial local storage data
    useEffect(() => {
        const loadLocalStorageData = async () => {
            let data = await AsyncStorage.getItem('@auth');
            let loginData = JSON.parse(data);
            console.log('Local Storage =>', loginData); 
            setState({...state, user: loginData?.user, token: loginData?.token
            }); 
        };

        loadLocalStorageData();
    }, []); // Dependency array ensures this effect runs only once

    return (
        <AuthContext.Provider value={[state, setState]}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };

