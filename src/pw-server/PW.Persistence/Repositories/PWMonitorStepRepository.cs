using System;
using Microsoft.EntityFrameworkCore;
using PW.Application.Repositories;
using PW.Domain.Entities;
using PW.Persistence.Context;

namespace PW.Persistence.Repositories;

public class PWMonitorStepRepository : Repository<PWMonitorStep>, IPWMonitorStepRepository
    {
        private readonly PWDbContext _context;
        public PWMonitorStepRepository(PWDbContext context) : base(context) { _context = context; }

        public async Task<IEnumerable<PWMonitorStep>> GetByMonitorIdAsync(Guid monitorId) =>
            await _context.MonitorSteps
                          .Where(s => s.MonitorId == monitorId)
                          .ToListAsync();
    }