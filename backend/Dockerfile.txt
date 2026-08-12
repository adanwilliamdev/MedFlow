# Estágio 1: Build
FROM maven:3.9.6-amazoncorretto-17 AS build

WORKDIR /app

# Copiar e baixar dependências
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiar código e compilar
COPY src ./src
RUN mvn clean package -DskipTests

# Estágio 2: Execução
FROM amazoncorretto:17-alpine

WORKDIR /app

# Instalar curl para healthcheck
RUN apk add --no-cache curl

# Copiar o JAR
COPY --from=build /app/target/*.jar app.jar

# Criar usuário não-root
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

EXPOSE 8080

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/api/actuator/health || exit 1

# Executar com o perfil de produção
ENTRYPOINT ["java", "-Dspring.profiles.active=${SPRING_PROFILES_ACTIVE:prod}", "-jar", "app.jar"]