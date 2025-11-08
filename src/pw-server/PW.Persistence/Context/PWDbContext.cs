using PW.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace PW.Persistence.Context
{
    public class PWDbContext : IdentityDbContext<PWUser>
    {
        public PWDbContext(DbContextOptions<PWDbContext> options)
            : base(options)
        {
        }

        public DbSet<PWMonitor> Monitors { get; set; }
        public DbSet<PWMonitorStep> MonitorSteps { get; set; }
        public DbSet<PWMonitorStepLog> MonitorStepLogs { get; set; }
    }
}