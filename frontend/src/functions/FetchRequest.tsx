import type {FetchError} from "@/types/FetchError.ts";
import type {TaskType} from "@/types/TaskType.ts";
import type {PlanType} from "@/types/PlanType.ts";
import {encrypt, decrypt} from "@/functions/Crypto.ts";
import type {TagType} from "@/types/TagType.ts";
import {getDefaultStore} from 'jotai';
import {errorModalContent} from "@/global/atoms.ts";

const URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8081"; // VITE_API_URL= (only at build time)

type Methods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS";
type Encryptable = TaskType | PlanType | TagType;

export const encryptBody = async (body: any): Promise<any> => {
    if (Array.isArray(body)) {
        return await Promise.all(body.map(encryptBody));
    }
    if (body && typeof body === "object") {
        const objectKeys: any = {};
        for (const [key, value] of Object.entries(body)) {
            objectKeys[key] = await encryptBody(value);
        }
        if ("data" in objectKeys) {
            return encrypt(objectKeys);
        }
        return objectKeys;
    }
    return body;
};

export const decryptBody = async (body: any): Promise<any> => {
    if (Array.isArray(body)) {
        return await Promise.all(body.map(decryptBody));
    }
    if (body && typeof body === "object") {
        const objectKeys: any = {};
        for (const [key, value] of Object.entries(body)) {
            objectKeys[key] = await decryptBody(value);
        }
        if ("data" in objectKeys) {
            return decrypt(objectKeys);
        }
        return objectKeys;
    }
    return body;
};

type FetchRequestFunction = {
    (method: Methods, request: string, body?: object | null): Promise<any>;
    (method: Methods, request: string, body?: Encryptable): Promise<Encryptable>;
    (method: Methods, request: string, body?: Encryptable[]): Promise<Encryptable[]>;
};

const FetchRequest: FetchRequestFunction = async (method, request, body) => {

    const headers = {
        "Content-Type": "application/json"
    };

    const options: RequestInit = {
        method,
        headers,
        credentials: "include"
    };

    if (body) {
        body = await encryptBody(body);
        options.body = JSON.stringify(body);
    }

    const response = await fetch(URL + request, options);

    if (!response.ok) {
        const error = new Error(`${response.statusText}`) as FetchError;
        error.status = response.status;
        if (error.status !== 401) {
            const store = getDefaultStore();
            const data = await response.json();
            store.set(errorModalContent, data.message);
        }
        throw error;
    }

    const responseText = await response.text();
    if (!responseText) return null;
    try {
        const receivedBody = JSON.parse(responseText);
        return await decryptBody(receivedBody);
    } catch {
        return responseText;
    }
}

export default FetchRequest;