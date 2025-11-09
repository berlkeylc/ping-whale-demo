using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PW.Application.Abstractions;
using PW.Application.Repositories;
using PW.Domain.Entities;
using PW.Persistence.Context;
using PW.Persistence.Repositories;
using PW.Persistence.Services;

namespace PW.Persistence;

public static class ServiceRegistration
{
    public static void AddPersistenceServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<PWDbContext>(options => options.UseNpgsql(configuration.GetConnectionString("PostgreSQL")));
        services.AddIdentity<PWUser, IdentityRole>().AddEntityFrameworkStores<PWDbContext>()
        .AddDefaultTokenProviders();
            
        services.AddScoped<IPWMonitorRepository, PWMonitorRepository>();
        services.AddScoped<IPWMonitorStepRepository, PWMonitorStepRepository>();
        services.AddScoped<IPWMonitorStepLogRepository, PWMonitorStepLogRepository>();
        services.AddScoped<IAuthService, AuthService>();

        }
    }

