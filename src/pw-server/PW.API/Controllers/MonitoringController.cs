using System;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PW.Application.Features.Monitoring.GetMonitors;
using PW.Application.Features.Monitoring.SaveMonitor;

namespace PW.API.Controllers;

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class MonitoringController : Controller
    {
    readonly IMediator _mediator;
        public MonitoringController(IMediator mediator)
        {
        _mediator = mediator;
        }
        
        [HttpGet("{id?}")]
        public async Task<IActionResult> Get(Guid? id)
        {
            var request = new GetMonitorsRequest(){ MonitorId = id };
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
