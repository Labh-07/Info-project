package com.example.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "service_requests") // MongoDB Collection
public class ServiceRequest {

    @Id
    private String id;
    private String serviceType;
    private String name;
    private String address;
    private String phoneNo;
    private String additionalNotes;

    // Constructors
    public ServiceRequest() {}

    public ServiceRequest(String serviceType, String name, String address, String phoneNo, String additionalNotes) {
        this.serviceType = serviceType;
        this.name = name;
        this.address = address;
        this.phoneNo = phoneNo;
        this.additionalNotes = additionalNotes;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getServiceType() {
        return serviceType;
    }

    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhoneNo() {
        return phoneNo;
    }

    public void setPhoneNo(String phoneNo) {
        this.phoneNo = phoneNo;
    }

    public String getAdditionalNotes() {
        return additionalNotes;
    }

    public void setAdditionalNotes(String additionalNotes) {
        this.additionalNotes = additionalNotes;
    }
}
