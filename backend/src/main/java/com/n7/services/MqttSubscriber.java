package com.n7.services;

import com.n7.configs.MqttProperties;
import com.n7.controllers.WebSocketController;
import com.n7.dto.EnvRecordDTO;
import com.n7.pojo.Device;
import com.n7.pojo.EnvRecord;
import com.n7.pojo.User;
import org.eclipse.paho.client.mqttv3.*;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class MqttSubscriber {
    private final ExpoPushNotificationService notificationService;

    @Autowired
    private DeviceService deviceService;

    @Autowired
    private UserService userService;

    private final MqttProperties mqttProperties;
    private final WebSocketController webSocketController;

    private EnvRecordDTO latestRecord;

    public MqttSubscriber(ExpoPushNotificationService notificationService, MqttProperties mqttProperties, WebSocketController webSocketController) {
        this.notificationService = notificationService;
        this.mqttProperties = mqttProperties;
        this.webSocketController = webSocketController;
        startSubscriber();
    }

    private void startSubscriber() {
        try {
            String clientId = mqttProperties.getClientId() + "-" + java.util.UUID.randomUUID();
            MqttClient client = new MqttClient(mqttProperties.getBroker(), clientId, null);

            MqttConnectOptions options = new MqttConnectOptions();
            options.setAutomaticReconnect(true);
            options.setCleanSession(true);

            if (mqttProperties.getUsername() != null && !mqttProperties.getUsername().isEmpty()) {
                options.setUserName(mqttProperties.getUsername());
                options.setPassword(mqttProperties.getPassword().toCharArray());
            }

            client.connect(options);
            client.subscribe(mqttProperties.getTopic(), (t, msg) -> {
                String payload = new String(msg.getPayload());
                System.out.println("Received: " + payload);

                JSONObject json = new JSONObject(payload);
                String device_code = json.getString("device_code");
                double temp = json.getDouble("temperature");
                double hum = json.getDouble("humidity");
                String relay = json.getString("relay");
                String condition = json.getString("condition");
                float defaultTemperature = json.getFloat("default_temperature");

                Device device = this.deviceService.getOrCreateByDeviceCode(device_code);

                if(condition.equals("abnormal")){
                    this.notificationService.sendPushNotification(device.getUser().getExpoToken(), "Cảnh báo nhiệt độ bất thường", "Thiết bị ở " + device.getWarehouse().getName() + "\nNhiệt độ: " + String.valueOf(temp));
                }

                EnvRecordDTO recordDTO = new EnvRecordDTO();
                recordDTO.setDeviceCode(device_code);
                recordDTO.setTemperature((float) temp);
                recordDTO.setHumidity((float) hum);
                recordDTO.setTimestamp(LocalDateTime.now());
                recordDTO.setCondition(condition);
                recordDTO.setRelay(relay);
                recordDTO.setDefaultTemperature(defaultTemperature);

                this.latestRecord = recordDTO;

                // Gửi dữ liệu real-time qua WebSocket
                webSocketController.sendDataToClients(recordDTO);

                System.out.println("Data sent to WebSocket: " + recordDTO);
            });

            System.out.println("Connected and subscribed to topic: " + mqttProperties.getTopic());

        } catch (MqttException e) {
            e.printStackTrace();
        }
    }
}
