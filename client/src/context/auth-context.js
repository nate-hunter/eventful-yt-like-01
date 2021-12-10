import React, { createContext, useContext, useEffect, useState } from "react"
import { useQuery } from "react-query";
import { client } from "../utils/api-client";


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const { data } = useQuery('AuthProvider', () => client.get('/auth/me')
        .then(resp => resp.data.user)
    );

    const user = data || null;

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
