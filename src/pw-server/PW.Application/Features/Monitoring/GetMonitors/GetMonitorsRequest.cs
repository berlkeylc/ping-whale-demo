using System;
using MediatR;

namespace PW.Application.Features.Monitoring.GetMonitors;

public class GetMonitorsRequest : IRequest<GetMonitorsResponse>
{
   public Guid UserId { get; set; }
   public Guid? MonitorId { get; set; }
}
