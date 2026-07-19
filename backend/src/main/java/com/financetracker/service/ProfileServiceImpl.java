package com.financetracker.service;

import com.financetracker.dto.AuthResponse;
import com.financetracker.dto.DeleteAccountRequest;
import com.financetracker.dto.ProfileUpdateRequest;
import com.financetracker.entity.User;
import com.financetracker.exception.EmailAlreadyExistsException;
import com.financetracker.exception.ResourceNotFoundException;
import com.financetracker.repository.BudgetRepository;
import com.financetracker.repository.TransactionRepository;
import com.financetracker.repository.UserRepository;
import com.financetracker.security.JwtService;
import com.financetracker.security.UserPrincipal;
import com.financetracker.util.EmailNormalizer;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Transactional
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public AuthResponse updateProfile(Long userId, ProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new BadCredentialsException("Current password is incorrect");
        }

        String email = EmailNormalizer.normalize(request.email());
        if (!user.getEmail().equals(email) && userRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException("An account with email " + email + " already exists");
        }

        user.setName(request.name());
        user.setEmail(email);

        if (StringUtils.hasText(request.newPassword())) {
            user.setPassword(passwordEncoder.encode(request.newPassword()));
        }

        User saved = userRepository.save(user);
        String token = jwtService.generateToken(new UserPrincipal(saved));

        return new AuthResponse(token, saved.getId(), saved.getName(), saved.getEmail());
    }

    @Override
    public void deleteAccount(Long userId, DeleteAccountRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new BadCredentialsException("Current password is incorrect");
        }

        // Explicit cleanup rather than relying on a DB-level ON DELETE
        // CASCADE: this works regardless of whether the local database's
        // foreign key was created with cascade behavior, which `ddl-auto:
        // update` doesn't reliably retrofit onto an already-existing
        // constraint from an earlier phase.
        transactionRepository.deleteByUserId(userId);
        budgetRepository.deleteByUserId(userId);
        userRepository.delete(user);
    }
}
