using MediatR;
using Microsoft.AspNetCore.Mvc;
using PW.Application.Features.Auth.Login;
using PW.Application.Features.Auth.Register;

namespace AuthApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        readonly IMediator _mediator;
        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("login")]
          public async Task<IActionResult> Login(LoginUserRequest loginUserCommandRequest)
        {
            LoginUserResponse response = await _mediator.Send(loginUserCommandRequest);
            return Ok(response);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(CreateUserRequest registerUserCommandRequest)
        {
            CreateUserResponse response = await _mediator.Send(registerUserCommandRequest);
            return Ok(response);
        }
    }
}