import { useLocalMutation, useLocalQuery } from "#/hooks/UseLocalQuery";
import { useNavigate } from "@tanstack/react-router";
import React, { createContext, useContext, useState, useEffect, type ReactNode, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
// Types for user and context
interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    logout: any;
    refreshUser: any;
    isLoading: boolean;
    isError: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
    const navigate = useNavigate();

    // Fetc
    const { data, refetch, isLoading, isError } = useLocalQuery({
        url: "/user/me",
        queryKey: ["user"],

    })

    const mutation = useLocalMutation({
        onSuccess: () => {
            toast.success("Logout successful!");
            refetch();
            navigate({ to: "/" });
        },
        onError: (error) => {
            console.error("Logout failed:", error);
            toast.error("Logout failed!");
        },
    });

    const logout = useCallback(() => {
        mutation.mutate({ url: "/auth/logout", method: "DELETE", data: {} });
    }, [mutation]);

    const contextValue = useMemo(
        () => ({ user: data?.user, logout, refreshUser: refetch, isLoading, isError }),
        [data, refetch, isLoading, isError, logout]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );

};


export function useAuth() {
    const context = React.useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};

