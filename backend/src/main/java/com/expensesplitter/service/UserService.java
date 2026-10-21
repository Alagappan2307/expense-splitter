package com.expensesplitter.service;

import com.expensesplitter.dto.CreateUserRequest;
import com.expensesplitter.dto.UserResponse;
import com.expensesplitter.entity.User;
import com.expensesplitter.exception.BadRequestException;
import com.expensesplitter.exception.ResourceNotFoundException;
import com.expensesplitter.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByNameIgnoreCase(request.getName().trim())) {
            throw new BadRequestException("User with name '" + request.getName().trim() + "' already exists");
        }
        User user = new User(request.getName().trim(), request.getEmail() != null ? request.getEmail().trim() : null);
        User saved = userRepository.save(user);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return mapToResponse(user);
    }

    public UserResponse mapToResponse(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getCreatedAt());
    }
}
