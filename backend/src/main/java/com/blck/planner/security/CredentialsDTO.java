package com.blck.planner.security;

public record CredentialsDTO(
        String username,
        String frontendPasswordHash,
        String passwordAuthSalt,
        String encryptionKeySalt
) {
}