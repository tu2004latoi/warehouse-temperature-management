package com.n7.controllers;

import com.n7.pojo.Device;
import com.n7.pojo.User;
import com.n7.pojo.Warehouse;
import com.n7.services.DeviceService;
import com.n7.services.UserService;
import com.n7.services.WarehouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.*;

@RestController
@RequestMapping("/api")
public class ApiDeviceController {

    @Autowired
    private DeviceService deviceService;

    @Autowired
    private UserService userService;

    @Autowired
    private WarehouseService warehouseService;

    @GetMapping("/devices")
    public ResponseEntity<?> getAllDevices(){
        List<Device> devices = this.deviceService.getAllDevices();
        List<Map<String, Object>> listData = new ArrayList<>();
        for (Device device : devices){
            Map<String, Object> data = new LinkedHashMap<>();
            data.put("deviceId", device.getDeviceId());
            data.put("userId", device.getUser() != null ? device.getUser().getUserId() : null); // ✅ tránh null
            data.put("deviceName", device.getDeviceName());
            data.put("deviceCode", device.getDeviceCode());

            listData.add(data);
        }

        return ResponseEntity.ok(listData);
    }

    @GetMapping("/devices/{id}")
    public ResponseEntity<?> getDeviceById(@PathVariable int id){
        Device device = this.deviceService.getDeviceById(id);
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("deviceId", device.getDeviceId());
        data.put("userId", device.getUser() != null ? device.getUser().getUserId() : null); // ✅ tránh null
        data.put("deviceName", device.getDeviceName());
        data.put("deviceCode", device.getDeviceCode());

        return ResponseEntity.ok(data);
    }

    @GetMapping("/my-devices")
    public ResponseEntity<?> getAllMyDevices(Principal principal){
        String username = principal.getName();
        User u = this.userService.getUserByUsername(username);
        List<Device> devices = this.deviceService.getDeviceByUser(u);
        List<Map<String, Object>> listData = new ArrayList<>();
        for (Device device : devices){
            Map<String, Object> data = new LinkedHashMap<>();
            data.put("deviceId", device.getDeviceId());
            data.put("userId", device.getUser() != null ? device.getUser().getUserId() : null); // ✅ an toàn
            data.put("deviceName", device.getDeviceName());
            data.put("deviceCode", device.getDeviceCode());

            listData.add(data);
        }

        return ResponseEntity.ok(listData);
    }

    @GetMapping("/devices/code/{deviceCode}")
    public ResponseEntity<Device> getDeviceByCode(@PathVariable String deviceCode){
        Device device = this.deviceService.getDeviceByDeviceCode(deviceCode);

        return ResponseEntity.ok(device);
    }

    @PostMapping("/devices/code/{deviceCode}")
    public ResponseEntity<Device> registryUserToDevice(@PathVariable String deviceCode, @RequestParam(name = "warehouseId") Integer warehouseId, Principal principal){
        Device device = this.deviceService.getDeviceByDeviceCode(deviceCode);
        Warehouse warehouse = this.warehouseService.getWarehouseById(warehouseId);
        deviceService.setDefaultTemperature(deviceCode, warehouse.getTemperature());
        device.setWarehouse(warehouse);
        String username = principal.getName();
        User user = this.userService.getUserByUsername(username);

        return ResponseEntity.ok(this.deviceService.registryUserToDevice(device, user));
    }

    @DeleteMapping("/devices/code/{deviceCode}")
    public ResponseEntity<String> deleteDeviceByCode(@PathVariable String deviceCode){
        Device device = this.deviceService.getDeviceByDeviceCode(deviceCode);
        this.deviceService.deleteDevice(device);

        return ResponseEntity.ok("ok");
    }
}
