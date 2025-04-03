package com.example.controller;//package com.example.controller;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.fasterxml.jackson.databind.node.ObjectNode;
//import com.example.model.PaymentRequest;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.*;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.client.RestTemplate;
//import java.util.UUID;
//
//@RestController
//@RequestMapping("/api/payments")
//public class PaymentController {
//
//    @Value("${razorpay.key.id}")
//    private String razorpayKeyId;
//
//    @Value("${razorpay.key.secret}")
//    private String razorpayKeySecret;
//
//    private final ObjectMapper objectMapper = new ObjectMapper();
//    private final RestTemplate restTemplate = new RestTemplate();
//
//    @PostMapping("/create-order")
//    public ResponseEntity<?> createOrder(@RequestBody PaymentRequest paymentRequest) {
//        try {
//            // 1. Create request headers
//            HttpHeaders headers = new HttpHeaders();
//            headers.setBasicAuth(razorpayKeyId, razorpayKeySecret);
//            headers.setContentType(MediaType.APPLICATION_JSON);
//
//            // 2. Create request body
//            ObjectNode requestBody = objectMapper.createObjectNode();
//            requestBody.put("amount", paymentRequest.getAmount() * 100); // Razorpay expects amount in paise
//            requestBody.put("currency", "INR");
//            requestBody.put("receipt", "order_" + UUID.randomUUID());
//            requestBody.put("payment_capture", 1);
//
//            // 3. Make the API call
//            HttpEntity<String> request = new HttpEntity<>(requestBody.toString(), headers);
//            ResponseEntity<String> response = restTemplate.postForEntity(
//                    "https://api.razorpay.com/v1/orders",
//                    request,
//                    String.class
//            );
//
//            // 4. Return the response
//            return ResponseEntity.ok(response.getBody());
//
//        } catch (Exception e) {
//            // 5. Handle errors
//            ObjectNode errorResponse = objectMapper.createObjectNode();
//            errorResponse.put("status", "error");
//            errorResponse.put("message", e.getMessage());
//            return ResponseEntity
//                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(errorResponse.toString());
//        }
//    }
//}

import com.example.model.*;
import com.example.repository.BillRepository;
import com.example.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BillRepository billRepository;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody PaymentRequest request) {
        // In a real app, you would call Razorpay API here to create an order
        // For simplicity, we'll just generate a mock order ID
        String orderId = "order_" + UUID.randomUUID().toString();

        Map<String, String> response = new HashMap<>();
        response.put("id", orderId);
        response.put("amount", String.valueOf(request.getAmount()));
        response.put("currency", "INR");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationRequest request) {
        // Verify payment with Razorpay (mock implementation)
        Payment payment = new Payment();
        payment.setTransactionId(request.getRazorpayPaymentId());
        payment.setAmount(request.getAmount());
        payment.setResidentId(request.getResidentId());
        payment.setStatus(PaymentStatus.COMPLETED);
        payment.setPaymentDate(new Date());
        paymentRepository.save(payment);

        // Update bill status
        if (request.getBillId() != null) {
            billRepository.findById(request.getBillId()).ifPresent(bill -> {
                bill.setPaid(true);
                billRepository.save(bill);
            });
        }

        return ResponseEntity.ok(Map.of("success", true));
    }

    @GetMapping("/resident/{residentId}")
    public ResponseEntity<List<Payment>> getPaymentHistory(@PathVariable String residentId) {
        return ResponseEntity.ok(paymentRepository.findByResidentId(residentId));
    }
}

