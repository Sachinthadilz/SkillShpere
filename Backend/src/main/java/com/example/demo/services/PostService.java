package com.example.demo.services;

import com.example.demo.models.Post;
import com.example.demo.repositories.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostService {

  @Autowired
  private PostRepository postRepository;

  public Post createPost(Post post) {
    post.setCreatedAt(LocalDateTime.now());
    return postRepository.save(post);
  }

  public Post updatePost(Long postId, Post updatedPost) {
    Post existingPost = postRepository.findById(postId)
            .orElseThrow(() -> new IllegalArgumentException("Post not found"));
    existingPost.setDescription(updatedPost.getDescription());
    existingPost.setImageUrl(updatedPost.getImageUrl());
    existingPost.setUpdatedAt(LocalDateTime.now());
    return postRepository.save(existingPost);
  }

  public void deletePost(Long postId) {
    postRepository.deleteById(postId);
  }

  public List<Post> getAllPosts() {
    return postRepository.findAll();
  }

  public Post getPostById(Long postId) {
    return postRepository.findById(postId)
            .orElseThrow(() -> new IllegalArgumentException("Post not found"));
  }
}