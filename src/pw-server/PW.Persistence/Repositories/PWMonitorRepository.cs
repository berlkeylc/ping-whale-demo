using System;
using Microsoft.EntityFrameworkCore;
using PW.Application.Repositories;
using PW.Domain.Entities;
using PW.Persistence.Context;

namespace PW.Persistence.Repositories;

public class PWMonitorRepository : Repository<PWMonitor>, IPWMonitorRepository
    {
        private readonly PWDbContext _context;

        public PWMonitorRepository(PWDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<PWMonitor> GetWithStepsAsync(Guid monitorId) =>
            await _context.Monitors
                          .FirstOrDefaultAsync(m => m.MonitorId == monitorId);
    }