package com.blck.central_persistence_service.accounts.Exceptions;

public class AccountAlreadyExistsException extends Exception {
	public AccountAlreadyExistsException(String message) {
		super(message);
	}
}
