package com.n7.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RelayService {

    private boolean relayState = false; // Trạng thái relay hiện tại
    private final MqttPublisher mqttPublisher;

    @Autowired
    public RelayService(MqttPublisher mqttPublisher) {
        this.mqttPublisher = mqttPublisher;
    }

    public void setRelay(String deviceCode, boolean state) {
        this.relayState = state;
        mqttPublisher.sendRelayCommand(deviceCode, state);
    }

    public boolean getRelayState() {
        return relayState;
    }

    public void setDefaultTemperature(String deviceCode, float temperature) {
        mqttPublisher.sendConfigCommand(deviceCode, temperature);
    }
}