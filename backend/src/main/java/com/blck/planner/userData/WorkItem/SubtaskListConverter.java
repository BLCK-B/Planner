package com.blck.planner.userData.WorkItem;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@Converter
public class SubtaskListConverter implements AttributeConverter<List<Subtask>, String> {

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<Subtask> subtasks) {
        if (subtasks == null) return null;
        return mapper.writeValueAsString(subtasks);
    }

    @Override
    public List<Subtask> convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        return mapper.readValue(dbData, new TypeReference<>() {});
    }
}
