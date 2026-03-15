# ---------------------------
# Build stage
# ---------------------------
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /build

# Copy only the pom first to leverage Docker cache
COPY pom.xml .

# Download dependencies (optional)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Package app (skip tests)
RUN mvn clean package -DskipTests

# ---------------------------
# Runtime stage
# ---------------------------
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy jar from build stage
COPY --from=builder /build/target/*.jar app.jar

# Expose port
EXPOSE 8097

# Run the Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]