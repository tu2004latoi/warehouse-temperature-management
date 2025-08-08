package com.n7.services;

import com.n7.pojo.Device;
import com.n7.pojo.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface DeviceService {
    Device addOrUpdateDevice(Device device);

    Device getDeviceById(int id);

    List<Device> getAllDevices();

    void deleteDevice(Device device);

    Device getDeviceByDeviceCode(String code);

    Device getOrCreateByDeviceCode(String deviceCode);

    List<Device> getDeviceByUser(User u);

    Device registryUserToDevice(Device device, User user);

    public void setDefaultTemperature(String deviceCode, float temperature);
}
