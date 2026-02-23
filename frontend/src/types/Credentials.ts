export type Credentials = {
    encryptionKey: string;
};

export type BackendCredentials = {
    frontendPasswordHash: string;
    passwordAuthSalt: string;
};