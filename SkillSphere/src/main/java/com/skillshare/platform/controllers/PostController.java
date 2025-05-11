package com.skillshare.platform.controllers;

import com.skillshare.platform.models.Post;
import com.skillshare.platform.models.User;
import com.skillshare.platform.repositories.UserRepository;
import com.skillshare.platform.security.services.UserDetailsImpl;
import com.skillshare.platform.services.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.skillshare.platform.services.CloudinaryService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/posts")
public class PostController {

  @Autowired
  private PostService postService;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private CloudinaryService cloudinaryService; // <-- Add this

  @PostMapping(value = "/add", consumes = "multipart/form-data")
  public ResponseEntity<?> createPost(
          @RequestParam("description") String description,
          @RequestParam(value = "images", required = false) MultipartFile[] images) throws IOException {

    // Get current authenticated user
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    User currentUser = userRepository.findById(userDetails.getId())
            .orElseThrow(() -> new RuntimeException("User not found"));

    Post post = new Post();
    post.setDescription(description);
    post.setUser(currentUser);
    post.setCreatedAt(LocalDateTime.now());

    // Handle multiple image uploads
    if (images != null && images.length > 0) {
      // Limit to 3 images
      if (images.length > 3) {
        return ResponseEntity.badRequest().body("Maximum 3 images allowed per post");
      }

      List<String> imageUrls = new ArrayList<>();

      for (MultipartFile image : images) {
        if (!image.isEmpty()) {
          String imageUrl = cloudinaryService.uploadImage(image);
          imageUrls.add(imageUrl);
        }
      }

      // Set both imageUrl (for backward compatibility) and imageUrls
      if (!imageUrls.isEmpty()) {
        post.setImageUrl(imageUrls.get(0));
        post.setImageUrls(imageUrls);
      }
    }

    Post savedPost = postService.createPost(post);
    return ResponseEntity.ok(savedPost);
  }

  @PutMapping(value = "/{postId}", consumes = "multipart/form-data")
  public ResponseEntity<?> updatePost(
          @PathVariable Long postId,
          @RequestParam("description") String description,
          @RequestParam(value = "images", required = false) MultipartFile[] images) throws IOException {

    Post existingPost = postService.getPostById(postId);
    existingPost.setDescription(description);

    // Update images if provided
    if (images != null && images.length > 0) {
      // Limit to 3 images
      if (images.length > 3) {
        return ResponseEntity.badRequest().body("Maximum 3 images allowed per post");
      }

      List<String> imageUrls = new ArrayList<>();

      for (MultipartFile image : images) {
        if (!image.isEmpty()) {
          // Upload to Cloudinary and get the URL
          String imageUrl = cloudinaryService.uploadImage(image);
          imageUrls.add(imageUrl);
        }
      }

      // Set both imageUrl (for backward compatibility) and imageUrls
      if (!imageUrls.isEmpty()) {
        existingPost.setImageUrl(imageUrls.get(0));
        existingPost.setImageUrls(imageUrls);
      }
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

  @GetMapping("/user/{userId}")
  public ResponseEntity<List<Post>> getPostsByUser(@PathVariable Long userId) {
    List<Post> userPosts = postService.getPostsByUserId(userId);
    return ResponseEntity.ok(userPosts);
  }
}