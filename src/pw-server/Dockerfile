# =========================
# BUILD STAGE
# =========================
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["pw-server.sln", "./"]
COPY ["PW.API/PW.API.csproj", "PW.API/"]
COPY ["PW.Application/PW.Application.csproj", "PW.Application/"]
COPY ["PW.Infrastructure/PW.Infrastructure.csproj", "PW.Infrastructure/"]
COPY ["PW.Persistence/PW.Persistence.csproj", "PW.Persistence/"]
COPY ["PW.Domain/PW.Domain.csproj", "PW.Domain/"]

RUN dotnet restore "./pw-server.sln"

COPY . .
WORKDIR /src/PW.API
RUN dotnet publish -c Release -o /app/publish


# =========================
# RUNTIME STAGE
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# PostgreSQL client ve netcat ekle (opsiyonel ama faydalı)
RUN apt-get update && \
    apt-get install -y postgresql-client netcat-openbsd && \
    rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .

# Cloud Run environment port (default 8080)
ENV ASPNETCORE_URLS=http://0.0.0.0:${PORT}
ENV PORT=8080

EXPOSE 8080

ENTRYPOINT ["dotnet", "PW.API.dll"]
