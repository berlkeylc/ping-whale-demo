using System;
using PW.Domain.Entities;

namespace PW.Application.Repositories;

public interface IPWMonitorRepository : IRepository<PWMonitor>
{
    Task<PWMonitor> GetWithStepsAsync(Guid monitorId);
}