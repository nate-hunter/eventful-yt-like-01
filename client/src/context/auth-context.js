import React, { createContext, useContext, useEffect, useState } from "react"
import { client } from "../utils/api-client";


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        client.get('/auth/me')
            .then(resp => setUser(resp.data.user));
    }, []);

    return (
        <AuthContext.Provider value={user}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used in a component w/in AuthProvider")
    }

    return context;
}
