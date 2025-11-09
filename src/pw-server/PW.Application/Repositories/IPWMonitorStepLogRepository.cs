using System;
using PW.Domain.Entities;

namespace PW.Application.Repositories;

public interface IPWMonitorStepLogRepository: IRepository<PWMonitorStepLog>
{
    Task<IEnumerable<PWMonitorStepLog>> GetByStepIdAsync(Guid stepId);
}