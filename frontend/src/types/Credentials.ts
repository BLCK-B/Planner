export type Credentials = {
    username: string;
    password: string;
};

export type BackendCredentials = {
    username: string;
    frontendPasswordHash: string;
    passwordAuthSalt: string;
};