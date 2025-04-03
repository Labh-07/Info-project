package com.example.repository;//package com.example.repository;
//
//import com.example.model.Payment;
//import org.springframework.data.mongodb.repository.MongoRepository;
//import java.util.List;
//
//public interface PaymentRepository extends MongoRepository<Payment, String> {
//    List<Payment> findByResidentId(String residentId);
//    List<Payment> findByBillId(String billId);
//}

import com.example.model.Bill;
import com.example.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PaymentRepository extends MongoRepository<Payment, String> {
    List<Payment> findByResidentId(String residentId);
}

