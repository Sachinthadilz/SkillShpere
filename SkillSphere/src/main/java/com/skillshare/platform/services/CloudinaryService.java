package com.skillshare.platform.services;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface CloudinaryService {
    String uploadImage(MultipartFile file) throws IOException;
    void deleteImage(String publicId) throws IOException;
}