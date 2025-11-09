using System;
using PW.Application.DTOS;
using PW.Domain.Entities;

namespace PW.Application.Abstractions;

    public interface IMonitorService
    {
        Task<IEnumerable<PWMonitor>> GetAllMonitorsAsync();
        Task<PWMonitor> GetMonitorByIdAsync(Guid id);
    Task<PWMonitor> CreateMonitorAsync(PWMonitor monitor, string url);
    //Task UpdateMonitorAsync(PWMonitor monitor);
    //Task DeleteMonitorAsync(Guid id);
        Task<List<MonitorClientModel>> GetMonitorsAsync(Guid userId, Guid? monitorId = null);
        Task<MonitorClientModel> GetMonitorClientModelAsync(Guid monitorId, Guid userId);
    }
