package com.n7.controllers;

import com.n7.services.DeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ApiTemperatureController {

    private final DeviceService deviceService;

    @Autowired
    public ApiTemperatureController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @PostMapping("/config/{deviceCode}/temperature")
    public String setDefaultTemperature(@PathVariable String deviceCode, @RequestParam float temperature) {
        if (temperature < 0 || temperature > 100) {
            return "Invalid temperature. Must be between 0 and 100°C.";
        }
        deviceService.setDefaultTemperature(deviceCode, temperature);
        return "Default temperature set to " + temperature + "°C for device: " + deviceCode;
    }
}