using System;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PW.Application.Features.Monitoring.GetMonitors;
using PW.Application.Features.Monitoring.SaveMonitor;

namespace PW.API.Controllers;

    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class MonitoringController : Controller
    {
        readonly IMediator _mediator;
    public MonitoringController(IMediator mediator)
    {
        _mediator = mediator;
    }
        
        private Guid GetUserId() =>
    Guid.Parse(User.FindFirst("sub")?.Value ?? throw new Exception("UserId not found"));
     

        [HttpGet("{id?}")]
        public async Task<IActionResult> Get(GetMonitorsRequest request)
        {
           GetMonitorsResponse response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Post(SaveMonitorRequest request)
        {
            SaveMonitorResponse response = await _mediator.Send(request);
            return Ok(response);
        }

    }
