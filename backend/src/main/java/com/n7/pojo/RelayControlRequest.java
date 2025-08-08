package com.n7.pojo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RelayControlRequest {
    private String deviceCode;
    private boolean turnOn;
    private String mode; // "manual" hoặc "auto"
}
