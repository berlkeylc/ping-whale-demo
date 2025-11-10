using System;
using Microsoft.Extensions.DependencyInjection;
using PW.Infrastructure.Services;

namespace PW.Infrastructure;

public static class ServiceRegistration
{
     public static void AddInfrastructureServices(this IServiceCollection serviceCollection)
        {
            serviceCollection.AddHostedService<PWSMonitoring>();
        }
}
