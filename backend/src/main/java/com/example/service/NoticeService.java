package com.example.service;

import com.example.model.Notice;
import com.example.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NoticeService {

    @Autowired
    private NoticeRepository noticeRepository;

    public Notice saveNotice(Notice notice) {
        return noticeRepository.save(notice);
    }

    public List<Notice> getAllNotices() {
        return noticeRepository.findAllByOrderByScheduleAtDesc();
    }

    public Notice updateNotice(String id, Notice noticeDetails) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notice not found"));

        notice.setTitle(noticeDetails.getTitle());
        notice.setContent(noticeDetails.getContent());
        notice.setScheduleAt(noticeDetails.getScheduleAt());
        notice.setImportant(noticeDetails.isImportant());

        return noticeRepository.save(notice);
    }

    public void deleteNotice(String id) {
        noticeRepository.deleteById(id);
    }
}