package com.n7.services;

import com.n7.configs.MqttProperties;
import org.eclipse.paho.client.mqttv3.*;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class MqttPublisher {

    private final MqttClient client;
    private final MqttProperties mqttProperties;

    private final String relayTopic = "esp32/relay";
    private final String configTopic = "esp32/config";

    public MqttPublisher(MqttProperties mqttProperties) throws MqttException {
        this.mqttProperties = mqttProperties;
        this.client = new MqttClient(mqttProperties.getBroker(), MqttClient.generateClientId(), null);

        MqttConnectOptions options = new MqttConnectOptions();
        options.setAutomaticReconnect(true);
        options.setCleanSession(true);

        if (mqttProperties.getUsername() != null && !mqttProperties.getUsername().isEmpty()) {
            options.setUserName(mqttProperties.getUsername());
            options.setPassword(mqttProperties.getPassword().toCharArray());
        }

        this.client.connect(options);
    }

    public void sendRelayCommand(String deviceCode, boolean turnOn) {
        try {
            String payload = String.format("{\"device_code\":\"%s\", \"relay\": \"%s\"}",
                    deviceCode, turnOn ? "ON" : "OFF");

            MqttMessage message = new MqttMessage(payload.getBytes());
            message.setQos(1);

            client.publish(relayTopic, message);
            System.out.printf("Sent to topic %s: %s%n", relayTopic, payload);

        } catch (MqttException e) {
            e.printStackTrace();
        }
    }


    public void sendConfigCommand(String deviceCode, float temperature) {
        try {
            String payload = String.format(Locale.US, "{\"device_code\": \"%s\", \"default_temperature\": %.1f}",
                    deviceCode, temperature);
            MqttMessage message = new MqttMessage(payload.getBytes());
            message.setQos(1);

            client.publish(configTopic, message);
            System.out.printf("Sent to topic %s: %s%n", configTopic, payload);

        } catch (MqttException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to send MQTT config message", e);
        }
    }
}
