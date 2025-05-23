package com.example.service;

import com.example.model.Post;
import com.example.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    private final String UPLOAD_DIR = "uploads/";

    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    public Post createPost(String title, String caption, MultipartFile image) {
        try {
            // Create uploads directory if it doesn't exist
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(image.getInputStream(), filePath);

            // Save post to database
            Post post = new Post();
            post.setTitle(title);
            post.setCaption(caption);
            post.setImageUrl(fileName);

            return postRepository.save(post);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    public void deletePost(String id) {
        // First get the post to access the image filename
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Delete the associated image file
        try {
            Path filePath = Paths.get(UPLOAD_DIR).resolve(post.getImageUrl());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Log the error but continue with post deletion
            System.err.println("Failed to delete image file: " + e.getMessage());
        }

        // Delete the post from database
        postRepository.deleteById(id);
    }
}