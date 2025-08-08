package com.n7.serviceimpl;

import com.n7.pojo.Warehouse;
import com.n7.repositories.WarehouseRepository;
import com.n7.services.WarehouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WarehouseServiceImpl implements WarehouseService {
    @Autowired
    private WarehouseRepository warehouseRepository;
    @Override
    public Warehouse addWarehouse(Warehouse warehouse) {
        return this.warehouseRepository.save(warehouse);
    }

    @Override
    public List<Warehouse> getAllWarehouse() {
        return this.warehouseRepository.findAll();
    }

    @Override
    public Warehouse getWarehouseById(int id) {
        Optional<Warehouse> warehouse = this.warehouseRepository.findById(id);
        return warehouse.orElse(null);
    }

    @Override
    public void deleteWarehouse(Warehouse warehouse) {
        this.warehouseRepository.delete(warehouse);
    }
}