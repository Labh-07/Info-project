package com.example.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "notices")
public class Notice {
    @Id
    private String id;
    private String title;
    private String content;  // Changed from description to match frontend
    private LocalDateTime scheduleAt;  // Changed from dateTime to match frontend
    private boolean isImportant;  // Added for frontend compatibility

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getScheduleAt() { return scheduleAt; }
    public void setScheduleAt(LocalDateTime scheduleAt) { this.scheduleAt = scheduleAt; }

    public boolean isImportant() { return isImportant; }
    public void setImportant(boolean important) { isImportant = important; }
}