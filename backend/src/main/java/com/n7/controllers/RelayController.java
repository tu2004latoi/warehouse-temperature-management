package com.n7.controllers;

import com.n7.services.RelayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class RelayController {

    private final RelayService relayService;

    @Autowired
    public RelayController(RelayService relayService) {
        this.relayService = relayService;
    }

    @PostMapping("/relay/{deviceCode}/on")
    public String turnOnRelay(@PathVariable String deviceCode) {
        relayService.setRelay(deviceCode, true);
        return "Relay turned ON for device: " + deviceCode;
    }

    @PostMapping("/relay/{deviceCode}/off")
    public String turnOffRelay(@PathVariable String deviceCode) {
        relayService.setRelay(deviceCode, false);
        return "Relay turned OFF for device: " + deviceCode;
    }

    @GetMapping("/relay/state")
    public String getRelayState() {
        return "Current relay state: " + (relayService.getRelayState() ? "ON" : "OFF");
    }
}