package com.auth_service.auth.exception;

public class EmailAlreadyExistsException extends RuntimeException  {

    public EmailAlreadyExistsException(String message) {
        super(message);
    }
}
