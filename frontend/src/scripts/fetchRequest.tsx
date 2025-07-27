import type {FetchError} from "@/types/FetchError.ts"

const URL = "http://localhost:8081";

type Methods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS";

const fetchRequest = async (method: Methods, request: string, body?: object | null) => {
    const headers = {
        "Content-Type": "application/json",
    };

    const options: RequestInit = {
        method: method,
        headers: headers,
        credentials: "include",
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(URL + request, options);

    if (!response.ok) {
        const error = new Error(`${response.statusText}`) as FetchError;
        error.status = response.status;
        throw error;
    }

    const token = await response.text();

    try {
        return JSON.parse(token);
    } catch {
        return token;
    }
};

export default fetchRequest;
