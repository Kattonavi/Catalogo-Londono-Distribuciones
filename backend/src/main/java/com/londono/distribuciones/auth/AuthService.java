package com.londono.distribuciones.auth;

import com.londono.distribuciones.auth.dto.AuthResponse;
import com.londono.distribuciones.auth.dto.LoginRequest;
import com.londono.distribuciones.auth.dto.RefreshTokenRequest;
import com.londono.distribuciones.common.exception.BadRequestException;
import com.londono.distribuciones.security.JwtProperties;
import com.londono.distribuciones.security.JwtService;
import com.londono.distribuciones.user.User;
import com.londono.distribuciones.user.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Base64;
import java.security.SecureRandom;

/**
 * Logica de autenticacion: login, refresh y logout.
 *
 * <p>El access token es un JWT firmado. El refresh token es opaco (cadena
 * aleatoria) y se persiste en el usuario con su expiracion; se rota en cada
 * refresh. Esto deja el flujo de refresh tokens preparado y funcional.</p>
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final JwtProperties jwtProperties;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthService(UserRepository userRepository,
                       AuthenticationManager authenticationManager,
                       JwtService jwtService,
                       JwtProperties jwtProperties) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.jwtProperties = jwtProperties;
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        User user = userRepository.findByEmailAndActiveTrue(authentication.getName())
                .orElseThrow(() -> new BadCredentialsException("Credenciales invalidas"));

        user.setLastLoginAt(Instant.now());
        String refreshToken = issueRefreshToken(user);

        return buildResponse(user, refreshToken);
    }

    @Transactional
    public AuthResponse refresh(RefreshTokenRequest request) {
        User user = userRepository.findByRefreshToken(request.refreshToken())
                .orElseThrow(() -> new BadRequestException("Refresh token invalido"));

        if (user.getRefreshTokenExpiresAt() == null
                || user.getRefreshTokenExpiresAt().isBefore(Instant.now())) {
            user.setRefreshToken(null);
            user.setRefreshTokenExpiresAt(null);
            throw new BadRequestException("Refresh token expirado");
        }

        // Rotacion del refresh token en cada uso.
        String rotated = issueRefreshToken(user);
        return buildResponse(user, rotated);
    }

    @Transactional
    public void logout(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            user.setRefreshToken(null);
            user.setRefreshTokenExpiresAt(null);
        });
    }

    private String issueRefreshToken(User user) {
        byte[] bytes = new byte[48];
        secureRandom.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        user.setRefreshToken(token);
        user.setRefreshTokenExpiresAt(Instant.now().plusMillis(jwtProperties.refreshExpirationMs()));
        return token;
    }

    private AuthResponse buildResponse(User user, String refreshToken) {
        String accessToken = jwtService.generateAccessToken(user);
        return new AuthResponse(
                accessToken,
                refreshToken,
                "Bearer",
                jwtProperties.accessExpirationMs() / 1000,
                new AuthResponse.UserSummary(
                        user.getId(), user.getName(), user.getEmail(), user.getRole().name())
        );
    }
}
