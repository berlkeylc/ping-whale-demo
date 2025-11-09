using System;
using Microsoft.EntityFrameworkCore;
using PW.Application.Repositories;
using PW.Domain.Entities;
using PW.Persistence.Context;

namespace PW.Persistence.Repositories;

public class PWMonitorStepLogRepository : Repository<PWMonitorStepLog>, IPWMonitorStepLogRepository
    {
        private readonly PWDbContext _context;
        public PWMonitorStepLogRepository(PWDbContext context) : base(context) { _context = context; }

        public async Task<IEnumerable<PWMonitorStepLog>> GetByStepIdAsync(Guid stepId) =>
            await _context.MonitorStepLogs
                          .Where(l => l.MonitorStepId == stepId)
                          .ToListAsync();
    }
