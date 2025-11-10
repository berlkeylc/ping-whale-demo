using System;
using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using PW.Application.Abstractions;
using PW.Application.DTOS;
using PW.Domain.Entities;
using PW.Persistence.Context;
using static PW.Domain.Entities.PWMonitorStep;

namespace PW.Persistence.Services;

public class MonitorService : IMonitorService
{
    private readonly PWDbContext _dbContext;
     private readonly IHttpContextAccessor _httpContextAccessor;

    public MonitorService(PWDbContext dbContext, IHttpContextAccessor httpContextAccessor)
    {
        _dbContext = dbContext;
        _httpContextAccessor = httpContextAccessor;
    }
    public async Task<PWMonitor> CreateMonitorAsync(PWMonitor monitor, string urlx)
    {
        var userId = _httpContextAccessor.HttpContext?.User?.FindFirst("sub")?.Value
                    ?? _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                      
        if (monitor == null)
            throw new ArgumentNullException(nameof(monitor));

        if (string.IsNullOrEmpty(monitor.Name))
            throw new ArgumentException("Name is required.", nameof(monitor));

        var monitorExists = await _dbContext.Monitors.AnyAsync(
            x => x.MonitorId != monitor.MonitorId &&
                 x.Name == monitor.Name &&
                 x.UserId == monitor.UserId);

        if (monitorExists)
            throw new InvalidOperationException("This project name is already in use. Please choose a different name.");

        PWMonitor entity;

        if (monitor.MonitorId != Guid.Empty)
        {
            entity = await _dbContext.Monitors
                .FirstOrDefaultAsync(x => x.MonitorId == monitor.MonitorId && x.UserId.ToString() == userId);

            if (entity == null)
                throw new InvalidOperationException("Monitor not found.");

            entity.Name = monitor.Name;
            entity.UpdatedDate = DateTime.UtcNow;
        }
        else 
        {
            entity = new PWMonitor
            {
                MonitorId = Guid.NewGuid(),
                Name = monitor.Name,
                UserId = userId != null ? Guid.Parse(userId) : Guid.Empty,
                CreatedDate = DateTime.UtcNow
            };

            await _dbContext.Monitors.AddAsync(entity);
        }

        var step = await _dbContext.MonitorSteps
            .FirstOrDefaultAsync(x => x.MonitorId == entity.MonitorId && x.Type == PWMonitorStepTypes.Request);

        var requestSettings = new PWSMonitorStepSettingsRequest
        {
            Url = urlx 
        };

        if (step != null)
        {
            var existingSettings = step.SettingsAsRequest() ?? new PWSMonitorStepSettingsRequest();
            existingSettings.Url = urlx;
            step.Settings = JsonSerializer.Serialize(existingSettings);
        }
        else
        {
            step = new PWMonitorStep
            {
                MonitorStepId = Guid.NewGuid(),
                MonitorId = entity.MonitorId,
                Type = PWMonitorStepTypes.Request,
                Settings = JsonSerializer.Serialize(requestSettings),
                Interval = 10
            };

            await _dbContext.MonitorSteps.AddAsync(step);
        }

        await _dbContext.SaveChangesAsync();

        return entity;
    }
    

    public Task<IEnumerable<PWMonitor>> GetAllMonitorsAsync()
    {
        throw new NotImplementedException();
    }

    public Task<PWMonitor> GetMonitorByIdAsync(Guid id)
    {
        throw new NotImplementedException();
    }

    public async Task<List<MonitorClientModel>> GetMonitorsAsync(Guid userId, Guid? monitorId = null)
    {
        List<PWMonitor> monitors;

        if (monitorId.HasValue)
        {
            if (monitorId.Value == Guid.Empty)
                throw new ArgumentException("You must send monitor id to get.", nameof(monitorId));

            var monitor = await _dbContext.Monitors
                .FirstOrDefaultAsync(x => x.MonitorId == monitorId.Value && x.UserId == userId);

            if (monitor == null)
                throw new InvalidOperationException("Monitor not found.");

            monitors = new List<PWMonitor> { monitor };
        }
        else
        {
            monitors = await _dbContext.Monitors
                .Where(x => x.UserId == userId)
                .ToListAsync();
        }

        var result = new List<MonitorClientModel>();
        foreach (var monitor in monitors)
        {
            var clientModel = await GetMonitorClientModelAsync(monitor.MonitorId, userId);
            result.Add(clientModel);
        }

        return result;
    }

    public async Task<MonitorClientModel> GetMonitorClientModelAsync(Guid monitorId, Guid userId)
    {
        var monitor = await _dbContext.Monitors
            .FirstOrDefaultAsync(x => x.MonitorId == monitorId && x.UserId == userId);

        if (monitor == null)
            throw new InvalidOperationException("Monitor not found.");

        var url = string.Empty;
        var loadTimes = new List<double>();
        var upTimes = new List<double>();
        double loadTime = 0, upTime = 0, downTime = 0, downTimePercent = 0;
        int totalMonitoredTime = 0;
        var stepStatus = PWMonitorStepStatusTypes.Unknown;

        var step = await _dbContext.MonitorSteps
            .FirstOrDefaultAsync(x => x.MonitorId == monitorId && x.Type == PWMonitorStepTypes.Request);

        if (step != null)
        {
            var settings = step.SettingsAsRequest();
            if (settings != null)
                url = settings.Url;

            var since = DateTime.UtcNow.AddDays(-14);
            var logs = await _dbContext.MonitorStepLogs
                .Where(x => x.MonitorStepId == step.MonitorStepId && x.StartDate >= since)
                .OrderBy(x => x.StartDate)
                .Take(20)
                .ToListAsync();

            if (logs.Any(x => x.Status == PWMonitorStepStatusTypes.Success))
                loadTime = logs.Where(x => x.Status == PWMonitorStepStatusTypes.Success)
                    .Average(x => x.EndDate.Subtract(x.StartDate).TotalMilliseconds);

            foreach (var log in logs)
            {
                totalMonitoredTime += log.Interval;
                if (log.Status == PWMonitorStepStatusTypes.Success)
                    loadTimes.Add(log.EndDate.Subtract(log.StartDate).TotalMilliseconds);

                if (log.Status == PWMonitorStepStatusTypes.Fail || log.Status == PWMonitorStepStatusTypes.Error)
                    downTime += log.Interval;

                var currentDownPercent = (downTime / totalMonitoredTime) * 100;
                var currentUpPercent = 100 - currentDownPercent;
                upTimes.Add(double.IsNaN(currentUpPercent) ? 0 : currentUpPercent);
            }

            var lastLog = logs.LastOrDefault();
            if (lastLog != null)
                stepStatus = lastLog.Status;

            downTimePercent = (downTime / totalMonitoredTime) * 100;
            upTime = 100 - downTimePercent;
        }

        if (double.IsNaN(upTime))
            upTime = 0;

        return new MonitorClientModel
        {
            MonitorId = monitor.MonitorId,
            CreatedDate = monitor.CreatedDate,
            LastCheckDate = monitor.LastCheckDate,
            MonitorStatus = monitor.MonitorStatus.ToString(),
            Name = monitor.Name,
            TestStatus = monitor.TestStatus.ToString(),
            UpdatedDate = monitor.UpdatedDate,
            Url = url,
            UpTime = upTime,
            UpTimes = upTimes,
            DownTime = downTime,
            DownTimePercent = downTimePercent,
            LoadTime = loadTime,
            LoadTimes = loadTimes,
            TotalMonitoredTime = totalMonitoredTime,
            StepStatus = stepStatus.ToString(),
            StepStatusText = stepStatus.ToString()
        };
    }
}
