using System;
using MediatR;
using PW.Application.Abstractions;

namespace PW.Application.Features.Monitoring.GetMonitors;

public class GetMonitorsHandler : IRequestHandler<GetMonitorsRequest, GetMonitorsResponse>
    {
        private readonly IMonitorService _monitorService;

        public GetMonitorsHandler(IMonitorService monitorService)
        {
            _monitorService = monitorService;
        }

        public async Task<GetMonitorsResponse> Handle(GetMonitorsRequest request, CancellationToken cancellationToken)
        {
            if (request.UserId == Guid.Empty)
                throw new ArgumentException("UserId is required.", nameof(request.UserId));

            var monitors = await _monitorService.GetMonitorsAsync(request.UserId, request.MonitorId);

            return new GetMonitorsResponse
            {
                Monitors = monitors
            };
        }
}