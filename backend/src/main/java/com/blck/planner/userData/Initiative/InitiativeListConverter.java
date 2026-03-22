package com.blck.planner.userData.Initiative;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@Converter
public class InitiativeListConverter implements AttributeConverter<List<InitiativeRecord>, String> {

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<InitiativeRecord> records) {
        if (records == null) return null;
        return mapper.writeValueAsString(records);
    }

    @Override
    public List<InitiativeRecord> convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        return mapper.readValue(dbData, new TypeReference<>() {
        });
    }
}
