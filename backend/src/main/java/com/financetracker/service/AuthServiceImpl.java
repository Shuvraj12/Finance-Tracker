package com.financetracker.service;

import com.financetracker.dto.AuthResponse;
import com.financetracker.dto.LoginRequest;
import com.financetracker.dto.RegisterRequest;
import com.financetracker.entity.User;
import com.financetracker.exception.EmailAlreadyExistsException;
import com.financetracker.repository.UserRepository;
import com.financetracker.security.JwtService;
import com.financetracker.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException(
                    "An account with email " + request.email() + " already exists");
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .build();

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(new UserPrincipal(savedUser));

        return new AuthResponse(token, savedUser.getId(), savedUser.getName(), savedUser.getEmail());
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        // Delegates the password check to Spring Security's DaoAuthenticationProvider
        // (configured in SecurityConfig), which throws BadCredentialsException on
        // a mismatch - GlobalExceptionHandler turns that into a 401.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UsernameNotFoundException("No user found with email: " + request.email()));

        String token = jwtService.generateToken(new UserPrincipal(user));

        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail());
    }
}
