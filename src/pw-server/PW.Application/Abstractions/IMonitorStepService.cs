using System;
using PW.Domain.Entities;

namespace PW.Application.Abstractions;

    public interface IMonitorStepService
    {
        Task<IEnumerable<PWMonitorStep>> GetStepsByMonitorIdAsync(Guid monitorId);
      
    }
