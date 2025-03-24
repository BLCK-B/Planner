package com.blck.central_persistence_service.accounts.Exceptions;

public class InvalidCredentialsException extends RuntimeException {
	public InvalidCredentialsException(String message) {
		super(message);
	}
}
