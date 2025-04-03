package com.example.model;//package com.example.model;
//
//import org.springframework.data.annotation.Id;
//import org.springframework.data.mongodb.core.mapping.Document;
//import java.util.Date;
//
//@Document(collection = "bills")
//public class Bill {
//    @Id
//    private String id;
//    private String residentId;
//    private String type;
//    private double amount;
//    private Date dueDate;
//    private boolean paid;
//    private Date createdAt;
//    private Date updatedAt;
//
//    // Constructors, getters, and setters
//    public Bill() {
//        this.createdAt = new Date();
//        this.updatedAt = new Date();
//    }
//
//    // Getters and setters
//    public String getId() {
//        return id;
//    }
//
//    public void setId(String id) {
//        this.id = id;
//    }
//
//    public String getResidentId() {
//        return residentId;
//    }
//
//    public void setResidentId(String residentId) {
//        this.residentId = residentId;
//    }
//
//    public String getType() {
//        return type;
//    }
//
//    public void setType(String type) {
//        this.type = type;
//    }
//
//    public double getAmount() {
//        return amount;
//    }
//
//    public void setAmount(double amount) {
//        this.amount = amount;
//    }
//
//    public Date getDueDate() {
//        return dueDate;
//    }
//
//    public void setDueDate(Date dueDate) {
//        this.dueDate = dueDate;
//    }
//
//    public boolean isPaid() {
//        return paid;
//    }
//
//    public void setPaid(boolean paid) {
//        this.paid = paid;
//        this.updatedAt = new Date();
//    }
//
//    public Date getCreatedAt() {
//        return createdAt;
//    }
//
//    public Date getUpdatedAt() {
//        return updatedAt;
//    }
//}

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

// Bill.java
@Document(collection = "bills")
public class Bill {
    @Id
    private String id;
    private String residentId;
    private String type;
    private double amount;
    private Date dueDate;
    private boolean paid;

    // Getters and setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getResidentId() {
        return residentId;
    }

    public void setResidentId(String residentId) {
        this.residentId = residentId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public Date getDueDate() {
        return dueDate;
    }

    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }

    public boolean isPaid() {
        return paid;
    }

    public void setPaid(boolean paid) {
        this.paid = paid;
    }
}

