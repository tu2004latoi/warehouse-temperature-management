package com.n7.services;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class ExpoPushNotificationService {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

    public void sendPushNotification(String expoToken, String title, String body) {
        Map<String, Object> message = new HashMap<>();
        message.put("to", expoToken);
        message.put("title", title);
        message.put("body", body);
        message.put("sound", "default");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Object> entity = new HttpEntity<>(message, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(EXPO_PUSH_URL, entity, String.class);
            System.out.println("Expo Response: " + response.getBody());
        } catch (Exception e) {
            System.err.println("Failed to send push notification: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
