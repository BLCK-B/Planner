// for converting between unicode and UTF bytes
const encoder = new TextEncoder();
const decoder = new TextDecoder();

const SALT_LENGTH = 16; // bytes

const P_HASH_ALGORITHM = "PBKDF2";
const P_HASH_INTERNAL_FUNC = "SHA-256";
const P_HASH_INTERNAL_ENCRYPTION = "AES-GCM";
const P_HASH_ITERATIONS = 150000;

const AES_KEY_LENGTH = 256; // bits

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

export const deriveEncryptionKey = async (
    salt: Uint8Array,
    masterPassword: string
): Promise<CryptoKey> => {
    const passwordBytes = encoder.encode(masterPassword);

    const passwordKey = await crypto.subtle.importKey(
        "raw",
        passwordBytes,
        P_HASH_ALGORITHM,
        false,
        ["deriveKey"]
    );

    return crypto.subtle.deriveKey(
        {
            name: P_HASH_ALGORITHM,
            salt,
            iterations: P_HASH_ITERATIONS,
            hash: P_HASH_INTERNAL_FUNC
        },
        passwordKey,
        {name: P_HASH_INTERNAL_ENCRYPTION, length: AES_KEY_LENGTH},
        false,
        ["encrypt", "decrypt"] // key usage
    );
};

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