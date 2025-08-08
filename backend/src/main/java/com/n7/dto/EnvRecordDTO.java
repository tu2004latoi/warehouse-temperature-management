package com.n7.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EnvRecordDTO {
    private Float temperature;
    private Float humidity;
    private String deviceCode;
    private LocalDateTime timestamp;
    private String relay;
    private String condition;
    private Float defaultTemperature;


    public Float getTemperature() {
        return temperature;
    }

    public void setTemperature(Float temperature) {
        this.temperature = temperature;
    }

    public Float getHumidity() {
        return humidity;
    }

    public void setHumidity(Float humidity) {
        this.humidity = humidity;
    }

    public String getDeviceCode() {
        return deviceCode;
    }

    public void setDeviceCode(String deviceCode) {
        this.deviceCode = deviceCode;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getRelay() {
        return relay;
    }

    public void setRelay(String relay) {
        this.relay = relay;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public Float getDefaultTemperature() {
        return defaultTemperature;
    }

    public void setDefaultTemperature(Float defaultTemperature) {
        this.defaultTemperature = defaultTemperature;
    }
}
