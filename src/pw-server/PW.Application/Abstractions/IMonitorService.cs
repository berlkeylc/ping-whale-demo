using System;
using PW.Domain.Entities;

namespace PW.Application.Abstractions;

    public interface IMonitorService
    {
        Task<IEnumerable<PWMonitor>> GetAllMonitorsAsync();
        Task<PWMonitor> GetMonitorByIdAsync(Guid id);
        Task<PWMonitor> CreateMonitorAsync(PWMonitor monitor);
        //Task UpdateMonitorAsync(PWMonitor monitor);
        //Task DeleteMonitorAsync(Guid id);
    }
