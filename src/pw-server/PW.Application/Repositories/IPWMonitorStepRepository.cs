using System;
using PW.Domain.Entities;

namespace PW.Application.Repositories;


public interface IPWMonitorStepRepository : IRepository<PWMonitorStep>
{
    Task<IEnumerable<PWMonitorStep>> GetByMonitorIdAsync(Guid monitorId);
}
