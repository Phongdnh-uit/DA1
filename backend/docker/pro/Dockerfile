# ============================
# BUILD STAGE
# ============================
FROM eclipse-temurin:24-jdk AS build

WORKDIR /build

COPY build.gradle settings.gradle gradlew ./
COPY gradle gradle

RUN chmod +x gradlew 

RUN ./gradlew dependencies --no-daemon

COPY ./src ./src

RUN ./gradlew clean bootJar --no-daemon


# ============================
# APP STAGE
# ============================

# FROM eclipse-temurin:24-jre-alpine
FROM eclipse-temurin:24-jre

# RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Tạo user/group chuẩn Debian
RUN addgroup --system appgroup && \
    adduser --system --ingroup appgroup appuser

WORKDIR /app

COPY --from=build /build/build/libs/*.jar app.jar

USER appuser

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
