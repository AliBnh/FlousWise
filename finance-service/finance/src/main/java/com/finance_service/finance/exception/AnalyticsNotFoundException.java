package com.finance_service.finance.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class AnalyticsNotFoundException extends RuntimeException {
    public AnalyticsNotFoundException(String message) {
        super(message);
    }

    public AnalyticsNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
