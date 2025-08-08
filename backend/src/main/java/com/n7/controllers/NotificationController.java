package com.n7.controllers;

import com.n7.dto.NotificationRequestDTO;
import com.n7.dto.TokenRequestDTO;
import com.n7.pojo.User;
import com.n7.services.ExpoPushNotificationService;
import com.n7.services.UserService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Data
@RestController
@RequestMapping("/api")
public class NotificationController {

    @Autowired
    private UserService userService;

    @PostMapping("/save-token")
    public ResponseEntity<String> saveExpoToken(@RequestBody TokenRequestDTO tokenRequest, Principal principal) {
        String username = principal.getName();
        User u = this.userService.getUserByUsername(username);

        if (u != null) {
            u.setExpoToken(tokenRequest.getToken());
            this.userService.addOrUpdateUser(u);
            return ResponseEntity.ok("Token saved successfully");
        } else {
            return ResponseEntity.badRequest().body("User not found");
        }
    }
}
