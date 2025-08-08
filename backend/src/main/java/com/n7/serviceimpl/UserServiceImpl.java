package com.n7.serviceimpl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.n7.pojo.User;
import com.n7.repositories.UserRepository;
import com.n7.security.CustomUserDetails;
import com.n7.services.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service("userDetailsService")
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User u = this.getUserByUsername(username);
        if (u == null) {
            throw new UsernameNotFoundException("Invalid username");
        }

        Set<GrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + u.getRole().name()));

        return new CustomUserDetails(u.getUserId(), u.getUsername(), u.getPassword(), authorities);
    }

    @Override
    @Transactional
    public User addOrUpdateUser(User u) {
        if (u.getFile() != null && !u.getFile().isEmpty()) {
            try {
                Map res = cloudinary.uploader().upload(u.getFile().getBytes(), ObjectUtils.asMap("resource_type", "auto"));
                u.setAvatar(res.get("secure_url").toString());
            } catch (IOException ex) {
                Logger.getLogger(UserServiceImpl.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

        if (u.getPassword() != null && !u.getPassword().isEmpty()) {
            u.setPassword(this.passwordEncoder.encode(u.getPassword()));
        } else if (u.getUserId() != null) {
            Optional<User> userSaved = this.userRepo.findById(u.getUserId());
            userSaved.ifPresent(user -> u.setPassword(user.getPassword()));
        }

        return this.userRepo.save(u);
    }

    @Override
    public User getUserByUsername(String username) {
        Optional<User> user = this.userRepo.findByUsername(username);
        return user.orElse(null);
    }

    @Override
    public User getUserByUserId(int id) {
        Optional<User> user = this.userRepo.findById(id);
        return user.orElse(null);
    }

    @Override
    public List<User> getAllUsers() {
        return this.userRepo.findAll();
    }

    @Override
    public boolean authenticate(String username, String password) {
        Optional<User> u = this.userRepo.findByUsername(username);
        if (u.isPresent()) {
            User user = u.get();
            return passwordEncoder.matches(password, user.getPassword());
        }

        return false;
    }

    @Override
    public void deleteUser(User u) {
        this.userRepo.delete(u);
    }
}
