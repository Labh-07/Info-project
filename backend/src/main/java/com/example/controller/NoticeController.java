package com.example.controller;

import com.example.model.Notice;
import com.example.service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notices")
@CrossOrigin(origins = "*") // Allow all origins
public class NoticeController {

    @Autowired
    private NoticeService noticeService;

    // Create Notice (matches frontend POST /notices/add-notice)
    @PostMapping("/add-notice")
    public ResponseEntity<Notice> createNotice(@RequestBody Notice notice) {
        Notice savedNotice = noticeService.saveNotice(notice);
        return ResponseEntity.ok(savedNotice);
    }

    // Get All Notices (matches frontend GET /notices)
    @GetMapping
    public ResponseEntity<List<Notice>> getAllNotices() {
        List<Notice> notices = noticeService.getAllNotices();
        return ResponseEntity.ok(notices);
    }

    // Update Notice (matches frontend PUT /notices/{id})
    @PutMapping("/{id}")
    public ResponseEntity<Notice> updateNotice(@PathVariable String id, @RequestBody Notice notice) {
        Notice updatedNotice = noticeService.updateNotice(id, notice);
        return ResponseEntity.ok(updatedNotice);
    }

    // Delete Notice (matches frontend DELETE /notices/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNotice(@PathVariable String id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.ok("Notice deleted successfully");
    }
}