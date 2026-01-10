package com.blck.planner.config;

import io.sentry.Sentry;
import tools.jackson.core.JacksonException;
import jakarta.persistence.PersistenceException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class SerializationExceptionHandler {

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public Map<String, Object> httpMessageNotReadableException(HttpMessageNotReadableException e) {
        Sentry.capture(e);
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", "serialisation_error");
        errorResponse.put("message", "Serialisation error: " + e.getMostSpecificCause().getMessage());
        return errorResponse;
    }

    @ExceptionHandler(JacksonException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public Map<String, Object> jsonProcessingException(JacksonException e) {
        Sentry.capture(e);
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", "serialisation_error");
        errorResponse.put("message", "JSON processing error: " + e.getOriginalMessage());
        return errorResponse;
    }

    @ExceptionHandler({DataIntegrityViolationException.class, PersistenceException.class})
    @ResponseStatus(HttpStatus.CONFLICT)
    @ResponseBody
    public Map<String, Object> handleDatabaseException(Exception e) {
        Sentry.capture(e);
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", "database_constraint_violation");
        errorResponse.put("message", "Database error: " + e.getMessage());
        return errorResponse;
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public Map<String, Object> handleAnyOtherException(Exception e) throws Exception {
        if (e instanceof AccessDeniedException || e instanceof AuthenticationException) {
            throw e;
        }
        Sentry.capture(e);
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", "internal_error");
        errorResponse.put("message", e.getMessage() != null ? e.getMessage() : "Unexpected error");
        return errorResponse;
    }
}

