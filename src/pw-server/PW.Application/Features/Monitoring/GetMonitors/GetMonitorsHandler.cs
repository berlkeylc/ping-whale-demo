using System;
using MediatR;
using PW.Application.Abstractions;

namespace PW.Application.Features.Monitoring.GetMonitors;

public class GetMonitorsHandler : IRequestHandler<GetMonitorsRequest, GetMonitorsResponse>
    {
        private readonly IMonitorService _monitorService;
        private readonly IAuthService _authService;

        public GetMonitorsHandler(IMonitorService monitorService, IAuthService authService)
        {
            _monitorService = monitorService;
            _authService = authService;
        }

        public async Task<GetMonitorsResponse> Handle(GetMonitorsRequest request, CancellationToken cancellationToken)
    {
            if (_authService.UserId == Guid.Empty)
                throw new ArgumentException("UserId is required.", nameof(_authService.UserId));

            var monitors = await _monitorService.GetMonitorsAsync((Guid)_authService.UserId, request.MonitorId);

            return new GetMonitorsResponse
            {
                Monitors = monitors
            };
        }
}