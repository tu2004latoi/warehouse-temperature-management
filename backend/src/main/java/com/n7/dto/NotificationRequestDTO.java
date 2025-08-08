package com.n7.dto;

import lombok.Data;

@Data
public class NotificationRequestDTO {
    private String token;
    private String title;
    private String body;
}