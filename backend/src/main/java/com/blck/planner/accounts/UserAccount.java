package com.blck.planner.accounts;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

// test: pass
@Entity
@Table(name = "accounts")
public class UserAccount implements UserDetails {

	@Id
    @GeneratedValue(generator = "UUID")
    @Column(name = "id")
    @JsonProperty("id")
    private UUID id;

    @Column(name = "username")
    private String username;

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    @Column(name = "password")
    private String password;

    @Column(name = "password_auth_salt")
    private String passwordAuthSalt;

    @Column(name = "encryption_key_salt")
    private String encryptionKeySalt;

    @Column(name = "enabled")
    private boolean enabled;

    @Column(name = "roles")
    private Set<String> roles;

    public UserAccount() {}

    public UserAccount(UUID id, String username, String password, String passwordAuthSalt, String encryptionKeySalt, boolean enabled, Set<String> roles) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.passwordAuthSalt = passwordAuthSalt;
        this.encryptionKeySalt = encryptionKeySalt;
        this.enabled = enabled;
        this.roles = roles;
    }

    @Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return roles.stream()
				.map(SimpleGrantedAuthority::new)
				.collect(Collectors.toList());
	}

	@Override
	public String getPassword() {
		return password;
	}

	@Override
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

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPasswordAuthSalt() {
        return passwordAuthSalt;
    }

    public void setPasswordAuthSalt(String passwordAuthSalt) {
        this.passwordAuthSalt = passwordAuthSalt;
    }

    public String getEncryptionKeySalt() {
        return encryptionKeySalt;
    }

    public void setEncryptionKeySalt(String encryptionKeySalt) {
        this.encryptionKeySalt = encryptionKeySalt;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }
}
