# Stage 1: Build the application
FROM maven:3.9.15-eclipse-temurin-21 AS build
#WORKDIR /server
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:21-jre-alpine
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring
#WORKDIR /server
COPY --from=build /server/target/*.jar server.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "server.jar"]
