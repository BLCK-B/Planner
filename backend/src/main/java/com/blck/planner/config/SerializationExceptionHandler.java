package com.blck.planner.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.persistence.PersistenceException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
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
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", "serialisation_error");
        errorResponse.put("message", "Serialisation error: " + e.getMostSpecificCause().getMessage());
        return errorResponse;
    }

    @ExceptionHandler(JsonProcessingException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public Map<String, Object> jsonProcessingException(JsonProcessingException e) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", "serialisation_error");
        errorResponse.put("message", "JSON processing error: " + e.getOriginalMessage());
        return errorResponse;
    }

    @ExceptionHandler({DataIntegrityViolationException.class, PersistenceException.class})
    @ResponseStatus(HttpStatus.CONFLICT)
    @ResponseBody
    public Map<String, Object> handleDatabaseException(Exception e) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", "database_constraint_violation");
        errorResponse.put("message", "Database error: " + e.getMessage());
        return errorResponse;
    }
}

