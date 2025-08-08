package com.n7.configs;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {
    @Bean
    public Cloudinary cloudinary(){
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", "druxxfmia");
        config.put("api_key", "437992527572232");
        config.put("api_secret", "ol1B4gKE-e_U-hqnpxnmPhD9nSA");
        return new Cloudinary(config);
    }
}