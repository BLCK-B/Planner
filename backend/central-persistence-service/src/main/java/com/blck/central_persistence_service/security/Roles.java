package com.blck.central_persistence_service.security;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

public enum Roles {
	ROLE_USER,
	ROLE_ADMIN;

	private static final Set<String> values =
			Arrays.stream(Roles.values())
					.map(Enum::name)
					.collect(Collectors.toSet());

	public static boolean doesRoleExist(String role) {
		return values.contains(role);
	}
}
