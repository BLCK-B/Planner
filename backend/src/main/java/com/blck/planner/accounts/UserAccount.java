package com.blck.planner.accounts;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "accounts")
public class UserAccount {

	@Id
    @GeneratedValue(generator = "UUID")
    @Column(name = "id")
    @JsonProperty("id")
    private UUID id;

    @Column(name = "username")
    private String username;

    @Column(name = "encryption_key_salt")
    private String encryptionKeySalt;

    @Column(name = "enabled")
    private boolean enabled;

    public UserAccount() {}

    public UserAccount(UUID id, String username, String encryptionKeySalt, boolean enabled) {
        this.id = id;
        this.username = username;
        this.encryptionKeySalt = encryptionKeySalt;
        this.enabled = enabled;
    }

	public String getUsername() {
		return username;
	}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEncryptionKeySalt() {
        return encryptionKeySalt;
    }

    public void setEncryptionKeySalt(String encryptionKeySalt) {
        this.encryptionKeySalt = encryptionKeySalt;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}
