package com.example.demo.controllers;

import com.example.demo.models.Post;
import com.example.demo.services.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/posts")
public class PostController {

  @Autowired
  private PostService postService;

  @PostMapping(value = "/add", consumes = "multipart/form-data")
  public ResponseEntity<Post> createPost(
          @RequestParam("description") String description,
          @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {
    Post post = new Post();
    post.setDescription(description);

    if (image != null && !image.isEmpty()) {
      String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
      Path uploadDir = Paths.get("uploads");
      Path filePath = uploadDir.resolve(fileName);

      if (!Files.exists(uploadDir)) {
        Files.createDirectories(uploadDir);
      }

      Files.write(filePath, image.getBytes());
      String imageUrl = "http://localhost:8081/uploads/" + fileName;
      post.setImageUrl(imageUrl);
    }

    Post savedPost = postService.createPost(post);
    return ResponseEntity.ok(savedPost);
  }

  @PutMapping(value = "/{postId}", consumes = "multipart/form-data")
  public ResponseEntity<Post> updatePost(
          @PathVariable Long postId,
          @RequestParam("description") String description,
          @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {
    Post existingPost = postService.getPostById(postId); // Fetch existing post
    existingPost.setDescription(description);

    if (image != null && !image.isEmpty()) {
      String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
      Path uploadDir = Paths.get("uploads");
      Path filePath = uploadDir.resolve(fileName);

      if (!Files.exists(uploadDir)) {
        Files.createDirectories(uploadDir);
      }

      Files.write(filePath, image.getBytes());
      String imageUrl = "http://localhost:8081/uploads/" + fileName;
      existingPost.setImageUrl(imageUrl);
    }

    Post updatedPost = postService.updatePost(postId, existingPost);
    return ResponseEntity.ok(updatedPost);
  }

  @DeleteMapping("/{postId}")
  public ResponseEntity<Void> deletePost(@PathVariable Long postId) {
    postService.deletePost(postId);
    return ResponseEntity.noContent().build();
  }

  @GetMapping
  public ResponseEntity<List<Post>> getAllPosts() {
    return ResponseEntity.ok(postService.getAllPosts());
  }

  @GetMapping("/{postId}")
  public ResponseEntity<Post> getPostById(@PathVariable Long postId) {
    return ResponseEntity.ok(postService.getPostById(postId));
  }
}