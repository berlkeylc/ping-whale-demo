using System;
using PW.Application.DTOS;

namespace PW.Application.Features.Monitoring.GetMonitors;

public class GetMonitorsResponse
{
    public List<MonitorClientModel> Monitors { get; set; } = new();
}
