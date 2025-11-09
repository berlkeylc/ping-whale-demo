using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using PW.Application.Abstractions;
using PW.Application.DTOS;
using PW.Domain.Entities;

namespace PW.Application.Features.Monitoring.SaveMonitor
{
    public class SaveMonitorHandler : IRequestHandler<SaveMonitorRequest, SaveMonitorResponse>
    {
        private readonly IMonitorService _monitorService;

        public SaveMonitorHandler(IMonitorService monitorService)
        {
            _monitorService = monitorService;
        }

        public async Task<SaveMonitorResponse> Handle(SaveMonitorRequest request, CancellationToken cancellationToken)
        {
            var entity = new PWMonitor
            {
                MonitorId = request.Id, 
                Name = request.Name,
            };

            var saved = await _monitorService.CreateMonitorAsync(entity, request.Url);

            return new SaveMonitorResponse
            {
                Id = saved.MonitorId,
            };
        }
    }
}