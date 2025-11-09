using System;
using MediatR;
using PW.Application.DTOS;

namespace PW.Application.Features.Monitoring.SaveMonitor
{
    public class SaveMonitorRequest : IRequest<SaveMonitorResponse>
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public required string  Url { get; set; }
    }

    public class SaveMonitorResponse
    {
        public Guid Id { get; set; }
    }
}