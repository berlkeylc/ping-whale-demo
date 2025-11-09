using System;
using PW.Domain.Entities;

namespace PW.Application.Abstractions;

    public interface IMonitorStepLogService
    {
        Task<IEnumerable<PWMonitorStepLog>> GetLogsByStepIdAsync(Guid stepId);
      
    }
