package com.n7.services;

import com.n7.pojo.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService extends UserDetailsService {
    User addOrUpdateUser(User u);
    User getUserByUsername(String username);
    User getUserByUserId(int id);
    List<User> getAllUsers();
    boolean authenticate(String username, String password);
    void deleteUser(User u);
    void updateExpoToken(User u, String token);
}
