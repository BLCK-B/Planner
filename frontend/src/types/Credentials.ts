export type Credentials = {
    encryptionPassword: string;
};

export type BackendCredentials = {
    frontendPasswordHash: string;
    passwordAuthSalt: string;
};