package com.skillshare.platform.repositories;

import com.skillshare.platform.models.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    // Use JPQL query to avoid property name issues
    @Query("SELECT p FROM Post p WHERE p.user.id = :userId")
    List<Post> findByUser_Id(@Param("userId") Long userId);
}