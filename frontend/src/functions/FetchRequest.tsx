import type {FetchError} from "@/types/FetchError.ts";
import type {Task} from "@/types/Task.ts";
import type {Plan} from "@/types/Plan.ts";
import {encrypt, decrypt} from "@/functions/Crypto.ts";

const URL = "http://localhost:8081";

type Methods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS";
type Encryptable = Task | Plan;

const encryptBody = async (body: any) => {
    if (Array.isArray(body) && body.length && ("data" in body[0])) {
        return await Promise.all(body.map((item) => encrypt(item)));
    } else if ("data" in body) {
        return await encrypt(body);
    }
    return body;
};

const decryptBody = async (body: any) => {
    if (Array.isArray(body) && body.length && ("data" in body[0])) {
        return await Promise.all(body.map((item) => decrypt(item)));
    } else if ("data" in body) {
        return await decrypt(body);
    }
    return body;
}

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