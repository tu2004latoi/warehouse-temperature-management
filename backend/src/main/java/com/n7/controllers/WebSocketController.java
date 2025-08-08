package com.n7.controllers;

import com.n7.dto.EnvRecordDTO;
import com.n7.pojo.EnvRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendDataToClients(EnvRecordDTO dto) {
        String topic = "/topic/esp32/" + dto.getDeviceCode();
        messagingTemplate.convertAndSend(topic, dto);
    }

}


