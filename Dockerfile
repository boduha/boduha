# Stage 1: Build React client
FROM node:22 AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client ./
RUN npm run build

# Stage 2: Build the server
FROM maven:3.9.15-eclipse-temurin-21 AS server-build
WORKDIR /app/server
COPY server/pom.xml .
RUN mvn dependency:go-offline
COPY --from=client-build /app/client/dist ./src/main/resources/static
COPY server/src ./src
RUN mvn clean package -DskipTests

# Stage 3: Run server, serve client
FROM eclipse-temurin:21-jre-alpine
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring
WORKDIR /
COPY --from=server-build /app/server/target/*.jar boduha.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "boduha.jar"]
