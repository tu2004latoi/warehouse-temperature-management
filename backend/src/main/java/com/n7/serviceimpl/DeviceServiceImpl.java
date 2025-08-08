package com.n7.serviceimpl;

import com.n7.pojo.Device;
import com.n7.pojo.User;
import com.n7.repositories.DeviceRepository;
import com.n7.services.DeviceService;
import com.n7.services.MqttPublisher;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class DeviceServiceImpl implements DeviceService {

    @Autowired
    private DeviceRepository deviceRepository;

    private final MqttPublisher mqttPublisher;

    public DeviceServiceImpl(MqttPublisher mqttPublisher) {
        this.mqttPublisher = mqttPublisher;
    }

    @Override
    @Transactional
    public Device addOrUpdateDevice(Device device) {
        return this.deviceRepository.save(device);
    }

    @Override
    public Device getDeviceById(int id) {
        Optional<Device> device = this.deviceRepository.findById(id);
        return device.orElse(null);
    }

    @Override
    public List<Device> getAllDevices() {
        return this.deviceRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteDevice(Device device) {
        this.deviceRepository.delete(device);
    }

    @Override
    public Device getDeviceByDeviceCode(String code) {
        return this.deviceRepository.findByDeviceCode(code).orElseThrow(()
                -> new RuntimeException("Device not found with code: " + code));
    }

    @Override
    public Device getOrCreateByDeviceCode(String deviceCode) {
        return deviceRepository.findByDeviceCode(deviceCode)
                .orElseGet(() -> {
                    Device newDevice = new Device();
                    newDevice.setDeviceCode(deviceCode);
                    newDevice.setDeviceName("ESP32 [" + deviceCode + "]");
                    newDevice.setUser(null); // chưa gán người dùng
                    return deviceRepository.save(newDevice);
                });
    }

    @Override
    public List<Device> getDeviceByUser(User u) {
        return this.deviceRepository.findByUser(u).orElse(Collections.emptyList());
    }

    @Override
    public Device registryUserToDevice(Device device, User user) {
        device.setUser(user);
        this.deviceRepository.save(device);
        return device;
    }

    @Override
    public void setDefaultTemperature(String deviceCode, float temperature) {
        if (deviceCode == null || deviceCode.trim().isEmpty()) {
            throw new IllegalArgumentException("Device code cannot be null or empty");
        }
        if (temperature < 0 || temperature > 100) {
            throw new IllegalArgumentException("Temperature must be between 0 and 100°C");
        }
        mqttPublisher.sendConfigCommand(deviceCode, temperature);
    }

}
