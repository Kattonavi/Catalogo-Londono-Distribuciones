package com.londono.distribuciones.security;

import com.londono.distribuciones.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

/**
 * Emision y validacion de JSON Web Tokens (HS256) con JJWT.
 *
 * <p>Genera el access token. El refresh token se trata como un token opaco
 * (cadena aleatoria) gestionado por {@code AuthService} y persistido en el
 * usuario; aqui se ofrece su tiempo de expiracion configurado.</p>
 */
@Service
public class JwtService {

    private final JwtProperties properties;
    private final SecretKey signingKey;

    public JwtService(JwtProperties properties) {
        this.properties = properties;
        this.signingKey = Keys.hmacShaKeyFor(properties.secret().getBytes(StandardCharsets.UTF_8));
    }

    /** Genera el access token para un usuario autenticado. */
    public String generateAccessToken(User user) {
        Instant now = Instant.now();
        Instant expiry = now.plusMillis(properties.accessExpirationMs());
        return Jwts.builder()
                .issuer(properties.issuer())
                .subject(user.getEmail())
                .claim("uid", user.getId())
                .claim("role", user.getRole().name())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(signingKey)
                .compact();
    }

    /** Extrae el subject (email) del token, validando firma y expiracion. */
    public String extractSubject(String token) {
        return parseClaims(token).getSubject();
    }

    /** Indica si el token es valido (firma correcta y no expirado). */
    public boolean isTokenValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    public long getRefreshExpirationMs() {
        return properties.refreshExpirationMs();
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
