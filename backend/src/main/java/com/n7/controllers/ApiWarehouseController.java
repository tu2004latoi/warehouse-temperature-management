package com.n7.controllers;

import com.n7.pojo.Warehouse;
import com.n7.services.WarehouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiWarehouseController {
    @Autowired
    private WarehouseService warehouseService;

    @GetMapping("/warehouses")
    public ResponseEntity<List<Warehouse>> getAllWarehouse(){
        return ResponseEntity.ok(this.warehouseService.getAllWarehouse());
    }

    @GetMapping("/warehouses/{id}")
    public ResponseEntity<Warehouse> getWarehouseById(@PathVariable int id){
        return ResponseEntity.ok(this.warehouseService.getWarehouseById(id));
    }

    @PostMapping("/warehouses/add")
    public ResponseEntity<Warehouse> addWarehouse(@RequestParam String name, @RequestParam Float temperature){
        Warehouse warehouse = new Warehouse();
        warehouse.setName(name);
        warehouse.setTemperature(temperature);
        return ResponseEntity.ok(this.warehouseService.addWarehouse(warehouse));
    }

    @DeleteMapping("/warehouses/{id}/delete")
    public ResponseEntity<String> deleteWarehouse(@PathVariable int id){
        Warehouse warehouse = this.warehouseService.getWarehouseById(id);

        this.warehouseService.deleteWarehouse(warehouse);
        return ResponseEntity.ok("ok");
    }
}