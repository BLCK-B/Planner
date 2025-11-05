import type {FetchError} from "@/types/FetchError.ts";
import type {Task} from "@/types/Task.ts";
import type {Plan} from "@/types/Plan.ts";
import {encrypt, decrypt} from "@/functions/Crypto.ts";

const URL = "http://localhost:8081";

type Methods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS";
type Encryptable = Task | Plan;

async function FetchRequest(method: Methods, request: string, body?: Encryptable): Promise<Encryptable>;
async function FetchRequest(method: Methods, request: string, body?: Encryptable[]): Promise<Encryptable[]>;
async function FetchRequest(method: Methods, request: string, body?: object | null): Promise<any>;

async function FetchRequest(method: Methods, request: string, body?: any): Promise<any> {
    const headers = {"Content-Type": "application/json"};
    const options: RequestInit = {method, headers, credentials: "include"};

    if (body) {
        if (Array.isArray(body) && body.length && ("data" in body[0])) {
            body = await Promise.all(body.map((item) => encrypt(item)));
        } else if ("data" in body) {
            body = await encrypt(body);
        }

        options.body = JSON.stringify(body);
    }

    const response = await fetch(URL + request, options);

    if (!response.ok) {
        const error = new Error(`${response.statusText}`) as FetchError;
        error.status = response.status;
        throw error;
    }

    const text = await response.text();
    if (!text) return null;

    try {
        const parsed = JSON.parse(text);

        // if (Array.isArray(parsed) && parsed.length && ("data" in parsed[0])) {
        //     return await Promise.all(parsed.map((item) => decrypt(item)));
        // } else if ("data" in parsed) {
        //     return await decrypt(parsed);
        // }

        return parsed;
    } catch {
        return text;
    }
}

export default FetchRequest;
