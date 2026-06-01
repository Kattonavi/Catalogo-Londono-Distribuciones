package com.londono.distribuciones.config;

import com.londono.distribuciones.common.domain.Role;
import com.londono.distribuciones.user.User;
import com.londono.distribuciones.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Crea un administrador inicial solo si la tabla users esta vacia.
 * Las credenciales provienen de variables de entorno (ADMIN_SEED_*). En
 * produccion la contrasena por defecto debe cambiarse.
 */
@Component
public class AdminSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminSeeder.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AdminSeedProperties properties;

    public AdminSeeder(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AdminSeedProperties properties) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.properties = properties;
    }

    @Override
    public void run(String... args) {
        if (!properties.enabled()) {
            return;
        }
        if (userRepository.count() > 0) {
            return;
        }

        User admin = new User(
                properties.name(),
                properties.email(),
                passwordEncoder.encode(properties.password()),
                Role.ADMIN
        );
        userRepository.save(admin);
        log.info("Administrador inicial creado con email '{}'. Cambia la contrasena en produccion.",
                properties.email());
    }
}
