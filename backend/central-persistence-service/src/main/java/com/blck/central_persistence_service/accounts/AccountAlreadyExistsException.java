package com.blck.central_persistence_service.accounts;

public class AccountAlreadyExistsException extends Exception {
	public AccountAlreadyExistsException(String message) {
		super(message);
	}
}
