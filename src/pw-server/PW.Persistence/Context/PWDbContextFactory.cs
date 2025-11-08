using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace PW.Persistence.Context;

public class PWDbContextFactory : IDesignTimeDbContextFactory<PWDbContext>
    {
        public PWDbContext CreateDbContext(string[] args)
    {
            
            var optionsBuilder = new DbContextOptionsBuilder<PWDbContext>();

            optionsBuilder.UseNpgsql(
                "Host=localhost;Port=5432;Database=pw-postgres-db;Username=postgres;Password=123456",
                b => b.MigrationsAssembly("PW.Persistence") 
            );

            return new PWDbContext(optionsBuilder.Options);
        }
    }