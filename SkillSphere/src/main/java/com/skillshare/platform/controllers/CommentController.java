package com.skillshare.platform.controllers;

import com.skillshare.platform.models.Comment;
import com.skillshare.platform.repositories.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
@CrossOrigin
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    @PostMapping
    public Comment createComment(@RequestBody Comment comment) {
        return commentRepository.save(comment);
    }

    @GetMapping("/post/{postId}")
    public List<Comment> getCommentsByPost(@PathVariable String postId) {
        return commentRepository.findByPostId(postId);
    }

    @PutMapping("/{id}")
    public Comment updateComment(@PathVariable String id, @RequestBody Comment updatedComment) {
        Comment comment = commentRepository.findById(id).orElseThrow();
        comment.setContent(updatedComment.getContent());
        return commentRepository.save(comment);
    }

    
}
