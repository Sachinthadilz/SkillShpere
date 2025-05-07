package com.skillshare.platform.controllers;

import com.skillshare.platform.models.Like;
import com.skillshare.platform.repositorys.LikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/likes")
@CrossOrigin
public class LikeController {

    @Autowired
    private LikeRepository likeRepository;

    @PostMapping("/like")
    public String likePost(@RequestParam String postId, @RequestParam String username) {
        if (likeRepository.findByPostIdAndUsername(postId, username).isPresent()) {
            return "Already liked!";
        }
        Like like = new Like();
        like.setPostId(postId);
        like.setUsername(username);
        likeRepository.save(like);
        return "Post liked!";
    }

    @PostMapping("/unlike")
    public String unlikePost(@RequestParam String postId, @RequestParam String username) {
        likeRepository.findByPostIdAndUsername(postId, username)
                .ifPresent(likeRepository::delete);
        return "Post unliked!";
    }

    @GetMapping("/count/{postId}")
    public long countLikes(@PathVariable String postId) {
        return likeRepository.findByPostId(postId).size();
    }
}
