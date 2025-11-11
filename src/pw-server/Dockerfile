# Build stage
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

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

RUN apt-get update && \
    apt-get install -y postgresql-client netcat-openbsd && \
    rm -rf /var/lib/apt/lists/*

COPY PW.API/wait-for-postgres.sh .
COPY --from=build /app/publish .

RUN chmod +x wait-for-postgres.sh

EXPOSE 80

ENTRYPOINT ["./wait-for-postgres.sh", "postgres", "dotnet", "PW.API.dll"]
