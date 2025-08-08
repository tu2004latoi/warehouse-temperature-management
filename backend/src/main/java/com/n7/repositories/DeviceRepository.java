package com.n7.repositories;

import com.n7.pojo.Device;
import com.n7.pojo.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Integer> {
    Optional<Device> findByDeviceCode(String code);
    Optional<List<Device>> findByUser(User user);
}
