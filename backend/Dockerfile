# =====================================================================
# Backend — Londoño Distribuciones (Java 25, Spring Boot 4)
# Multi-stage build para Railway (builder = DOCKERFILE).
# Fija Java 25 explícitamente para evitar que Railpack instale JDK 21.
# =====================================================================

# ---- Build stage: compila el JAR con el Maven Wrapper ----
FROM eclipse-temurin:25-jdk AS build
WORKDIR /app

# Copia el proyecto (target/, .git, .env, etc. se excluyen vía .dockerignore).
COPY . .

# El wrapper debe ser ejecutable en Linux.
RUN chmod +x ./mvnw
# Compila y empaqueta (sin tests para acelerar el deploy).
RUN ./mvnw -DskipTests package

# ---- Runtime stage: imagen ligera solo con el JRE ----
# eclipse-temurin:25-jre existe (Java 25 es LTS). Si en algún registro fallara,
# se puede usar eclipse-temurin:25-jdk como runtime sin más cambios.
FROM eclipse-temurin:25-jre
WORKDIR /app

# El artifactId/version del pom.xml definen el nombre del JAR.
COPY --from=build /app/target/distribuciones-backend-0.0.1-SNAPSHOT.jar app.jar

# Documentativo: la app escucha en server.port = ${PORT:8080}.
# En Railway, PORT lo inyecta la plataforma y Spring Boot lo respeta.
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
