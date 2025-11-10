
using PW.Persistence;
using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Reflection;
using PW.Application.Features.Auth.Register;
using PW.API.Extensions;
using PW.Infrastructure;

Env.Load();
var builder = WebApplication.CreateBuilder(args);

//Define CORS policy to allow Angular client
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularClient",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:4200") // Angular app adresi
                .WithOrigins("https://localhost:4200")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
});
//Define CORS policy to allow Angular client

//Configure MediatR
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssemblies(
        Assembly.GetExecutingAssembly(),
        typeof(CreateUserHandler).Assembly // Handler assembly
    );
});
//Configure MediatR

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

/// For Swagger UI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
/// For Swagger UI

// For Auth JWT Configuration
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});
// For Auth JWT Configuration

/// Add services to the container.
builder.Services.AddHttpContextAccessor();
builder.Services.AddPersistenceServices(builder.Configuration);
builder.Services.AddInfrastructureServices();
/// Add services to the container.


builder.Services.AddControllers();

var app = builder.Build();




// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    //For Swagger UI 
    app.UseSwagger();
    app.UseSwaggerUI();
    //For Swagger UI 
}

// Global Exception Handling Middleware
app.ConfigureExceptionHandler<Program>(app.Services.GetRequiredService<ILogger<Program>>());
// Global Exception Handling Middleware


app.UseHttpsRedirection();


// Apply CORS policy
app.UseCors("AllowAngularClient");
// Apply CORS policy

// For Auth 
app.UseAuthentication();
app.UseAuthorization();
// For Auth

app.MapControllers();

app.Run();

