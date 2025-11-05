import {type Task, TaskEncryptSpec} from "@/types/Task.ts";
import type {Plan} from "@/types/Plan.ts";

// for converting between unicode text and UTF bytes
const encoder = new TextEncoder();
const decoder = new TextDecoder();

const SALT_LENGTH = 16; // bytes

const P_HASH_ALGORITHM = "PBKDF2";
const P_HASH_INTERNAL_FUNC = "SHA-256";
const P_HASH_INTERNAL_ENCRYPTION = "AES-GCM";
const P_HASH_ITERATIONS = 150000;

const ENCRYPTION_ALGORITHM = "AES-GCM";
const AES_KEY_LENGTH = 256; // bits
const AES_NONCE_LENGTH = 12; //

/** ----- helpers ----- */

// byte values need to be converted to ASCII so they can be stored
export const encodeToBase64 = (bytes: Uint8Array): string => {
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
};

export const decodeFromBase64 = (base64: string): Uint8Array => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
};

export const generateNewSalt = (): Uint8Array => {
    return crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
};

/** ----- hashing ----- */

export const deriveAuthHash = async (
    salt: Uint8Array,
    masterPassword: string
): Promise<string> => {
    const passwordBytes = encoder.encode(masterPassword);

    const passwordKey = await crypto.subtle.importKey(
        "raw",
        passwordBytes,
        P_HASH_ALGORITHM,
        false,
        ["deriveBits"]
    );

    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: P_HASH_ALGORITHM,
            salt,
            iterations: P_HASH_ITERATIONS,
            hash: P_HASH_INTERNAL_FUNC
        },
        passwordKey,
        AES_KEY_LENGTH
    );

    return btoa(String.fromCharCode(...new Uint8Array(derivedBits)));
}

/** ----- encryption ----- */

export const createEncryptionKey = async (
    salt: Uint8Array,
    masterPassword: string
): Promise<void> => {
    const passwordBytes = encoder.encode(masterPassword);

    const passwordKey = await crypto.subtle.importKey(
        "raw",
        passwordBytes,
        P_HASH_ALGORITHM,
        false,
        ["deriveKey"]
    );

    const encryptionKey = await crypto.subtle.deriveKey(
        {
            name: P_HASH_ALGORITHM,
            salt,
            iterations: P_HASH_ITERATIONS,
            hash: P_HASH_INTERNAL_FUNC
        },
        passwordKey,
        {name: P_HASH_INTERNAL_ENCRYPTION, length: AES_KEY_LENGTH},
        true,
        ["encrypt", "decrypt"]
    );

    const rawKey = await crypto.subtle.exportKey("raw", encryptionKey);
    const encodedKey = btoa(String.fromCharCode(...new Uint8Array(rawKey)));
    sessionStorage.setItem("encryptionKey", encodedKey);
};

const getCryptoKey = async (): Promise<CryptoKey> => {
    const keyBase64 = sessionStorage.getItem("encryptionKey");
    if (!keyBase64) {
        throw new Error("Encryption key not found in session storage");
    }
    const rawKey = decodeFromBase64(keyBase64);
    return crypto.subtle.importKey(
        "raw",
        rawKey,
        {name: ENCRYPTION_ALGORITHM},
        false,
        ["encrypt", "decrypt"]
    );
};

const generateIV = (): Uint8Array => {
    return crypto.getRandomValues(new Uint8Array(AES_NONCE_LENGTH));
};

export const encryptFields = async (
    value: any,
    spec: { [key: string]: boolean },
    cryptoKey: CryptoKey
): Promise<any> => {
    const result: any = {...value};

    for (const key in spec) {
        if (spec[key]) {
            const iv = generateIV(); // initialisation vector
            const encoded = encoder.encode(JSON.stringify(value[key])); // -> string -> UTF-8 bytes
            const ciphertext = await crypto.subtle.encrypt({name: ENCRYPTION_ALGORITHM, iv}, cryptoKey, encoded);

            const combined = new Uint8Array(iv.byteLength + ciphertext.byteLength);
            combined.set(iv, 0); // vector first
            combined.set(new Uint8Array(ciphertext), iv.byteLength); // ciphertext bytes second

            result[key] = encodeToBase64(combined);
        } else {
            result[key] = value[key];
        }
    }
    return result;
};

export const decryptFields = async (
    value: any,
    spec: { [key: string]: boolean },
    cryptoKey: CryptoKey
): Promise<any> => {
    const result: any = {...value};

    for (const key in spec) {
        if (spec[key]) {
            const combined = decodeFromBase64(value[key]);
            const iv = combined.slice(0, AES_NONCE_LENGTH);
            const ciphertext = combined.slice(AES_NONCE_LENGTH);
            const decryptedBuffer = await crypto.subtle.decrypt({name: "AES-GCM", iv}, cryptoKey, ciphertext);
            result[key] = JSON.parse(decoder.decode(decryptedBuffer));
        } else {
            result[key] = value[key];
        }
    }
    return result;
};

export const encrypt = async (item: Task | Plan): Promise<Task | Plan> => {
    if ("data" in item) {
        const cryptoKey = await getCryptoKey();
        const spec = TaskEncryptSpec; // TODO: plan spec
        const encryptedData = await encryptFields(item.data, spec, cryptoKey);
        return {...item, data: encryptedData};
    }
    return item;
};

export const decrypt = async (item: Task | Plan): Promise<Task | Plan> => {
    if ("data" in item) {
        const cryptoKey = await getCryptoKey();
        const spec = TaskEncryptSpec;
        const decryptedData = await decryptFields(item.data, spec, cryptoKey);
        return {...item, data: decryptedData};
    }
    return item;
};

// TODO: tables separately - fetch all in table, reencrypt all in client, then send
// TODO: special endpoints for this (replace with ids staying the same + verify)
export const reencryptAllData = async () => {

};