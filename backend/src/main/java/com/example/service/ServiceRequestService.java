package com.example.service;

import com.example.model.ServiceRequest;
import com.example.repository.ServiceRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ServiceRequestService {

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    public ServiceRequest saveServiceRequest(ServiceRequest serviceRequest) {
        return serviceRequestRepository.save(serviceRequest);
    }

    public List<ServiceRequest> getAllServiceRequests() {
        return serviceRequestRepository.findAll();
    }

    public Optional<ServiceRequest> getServiceRequestById(String id) {
        return serviceRequestRepository.findById(id);
    }

    public List<ServiceRequest> getServiceRequestsByType(String serviceType) {
        return serviceRequestRepository.findByServiceType(serviceType);
    }

    public List<ServiceRequest> getServiceRequestsByName(String name) {
        return serviceRequestRepository.findByName(name); // 🔹 Fetch service by name
    }
}
