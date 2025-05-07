package com.skillshare.platform.repositories;

import com.skillshare.platform.models.Like;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface LikeRepository extends MongoRepository<Like, String> {
    List<Like> findByPostId(String postId);
    Optional<Like> findByPostIdAndUsername(String postId, String username);
}
