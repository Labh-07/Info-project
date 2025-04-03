package com.example.controller;//package com.example.controller;
//
//
//import com.example.model.Bill;
//import com.example.model.Payment;
//import com.example.service.BillingService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/bills")
//public class BillingController {
//
//    @Autowired
//    private BillingService billingService;
//
//    @GetMapping("/resident/{residentId}")
//    public ResponseEntity<List<Bill>> getBillsByResident(@PathVariable String residentId) {
//        return ResponseEntity.ok(billingService.getBillsByResident(residentId));
//    }
//
//    @GetMapping("/resident/{residentId}/unpaid")
//    public ResponseEntity<List<Bill>> getUnpaidBills(@PathVariable String residentId) {
//        return ResponseEntity.ok(billingService.getUnpaidBillsByResident(residentId));
//    }
//
//    @PostMapping
//    public ResponseEntity<Bill> createBill(@RequestBody Bill bill) {
//        return ResponseEntity.ok(billingService.createBill(bill));
//    }
//
//    @PostMapping("/pay")
//    public ResponseEntity<Payment> processPayment(@RequestBody Payment payment) {
//        return ResponseEntity.ok(billingService.processPayment(payment));
//    }
//
//    @GetMapping("/payments/{residentId}")
//    public ResponseEntity<List<Payment>> getPaymentHistory(@PathVariable String residentId) {
//        return ResponseEntity.ok(billingService.getPaymentHistory(residentId));
//    }
//}

import com.example.model.Bill;
import com.example.model.PaymentRequest;
import com.example.repository.BillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    @Autowired
    private BillRepository billRepository;

    @GetMapping("/resident/{residentId}")
    public ResponseEntity<List<Bill>> getBills(@PathVariable String residentId) {
        return ResponseEntity.ok(billRepository.findByResidentId(residentId));
    }

    @PostMapping("/pay")
    public ResponseEntity<?> processPayment(@RequestBody PaymentRequest request) {
        // This would be called after successful Razorpay payment
        Bill bill = billRepository.findById(request.getBillId())
                .orElseThrow(() -> new RuntimeException("Bill not found"));

        bill.setPaid(true);
        billRepository.save(bill);

        return ResponseEntity.ok(Map.of("success", true));
    }
}