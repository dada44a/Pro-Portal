"use client"

import { useMutation, useQuery } from "@tanstack/react-query"

const fetchWithRefresh = async (url: string, options: RequestInit) => {
    const fullUrl = `${import.meta.env.VITE_API_URL}${url}`;
    let response = await fetch(fullUrl, options);

    if (response.status === 401 && !url.includes("/auth/refresh")) {
        console.log("Token expired, attempting refresh...");
        const refreshResponse = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
            method: "GET",
            credentials: "include",
        });

        if (refreshResponse.ok) {
            console.log("Token refreshed successfully, retrying request...");
            response = await fetch(fullUrl, options);
        } else {
            console.error("Refresh failed, logging out.");
            throw new Error("Unauthorized");
        }
    }

    if (!response.ok) {
        throw new Error("Failed to fetch data");
    }

    return response;
};

export const useLocalQuery = ({ queryKey, url }: { queryKey: string[], url: string }) => {
    return useQuery({
        queryKey: queryKey,
        queryFn: async () => {
            const response = await fetchWithRefresh(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
            });
            return response.json();
        },
    })
}

export const useLocalMutation = ({ onSuccess, onError }: { onSuccess?: (message: any) => void, onError?: (error: any) => void }) => {
    return useMutation({
        mutationFn: async ({ url, data, method }: { url: string, data: any, method: string }) => {
            try {
                const response = await fetchWithRefresh(url, {
                    method: method,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: data ? JSON.stringify(data) : undefined
                });

                const responseData = await response.json().catch(() => null);
                return { ...response, data: responseData };
            } catch (error: any) {
                throw error instanceof Error
                    ? error
                    : new Error(error?.message || "An unknown error occurred");
            }
        },

        onError: (error) => {
            console.error("Mutation error:", error);
            if (onError && error instanceof Error) {
                onError(error.message);
            }
        },
        onSuccess: (success: any) => {
            if (onSuccess) onSuccess(success?.data?.message || success?.message);
        }
    })
}