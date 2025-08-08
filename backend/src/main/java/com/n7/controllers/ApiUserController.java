package com.n7.controllers;

import com.n7.pojo.User;
import com.n7.services.UserService;
import com.n7.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class ApiUserController {
    @Autowired
    private UserService userSer;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers(){
        return ResponseEntity.ok(userSer.getAllUsers ());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable int id){
        User u = this.userSer.getUserByUserId(id);
        return ResponseEntity.ok(u);
    }

    @PostMapping("/users/add")
    public ResponseEntity<User> addUser(@ModelAttribute User u){
        return ResponseEntity.ok(this.userSer.addOrUpdateUser(u));
    }

    @PatchMapping("/users/{id}/update")
    public ResponseEntity<User> updateUser(@PathVariable Integer id, @ModelAttribute User u){
        User user = this.userSer.getUserByUserId(id);
        if (u.getFirstName() != null)
            user.setFirstName(u.getFirstName());

        if (u.getLastName() != null)
            user.setLastName(u.getLastName());

        if (u.getEmail() != null)
            user.setEmail(u.getEmail());

        if (u.getPhone() != null)
            user.setPhone(u.getPhone());

        if (u.getFile() != null && !u.getFile().isEmpty()) {
            user.setFile(u.getFile());
        }

        if (u.getPassword() != null && !u.getPassword().isBlank()) {
            user.setPassword(u.getPassword());
        }

        return ResponseEntity.ok(this.userSer.addOrUpdateUser(user));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody User u) {
        if (u.getUsername() == null || u.getPassword() == null) {
            return ResponseEntity.badRequest().body("Username hoặc password không được để trống");
        }

        if (this.userSer.authenticate(u.getUsername(), u.getPassword())) {
            try {
                String token = JwtUtils.generateToken(u.getUsername());
                return ResponseEntity.ok().body(Collections.singletonMap("token", token));
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Lỗi khi tạo JWT");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sai thông tin đăng nhập");
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable int id){
        User u = this.userSer.getUserByUserId(id);
        this.userSer.deleteUser(u);
        return ResponseEntity.ok("ok");
    }

    @RequestMapping("/secure/profile")
    @ResponseBody
    @CrossOrigin
    public ResponseEntity<User> getProfile(Principal principal) {
        return new ResponseEntity<>(this.userSer.getUserByUsername(principal.getName()), HttpStatus.OK);
    }

}
