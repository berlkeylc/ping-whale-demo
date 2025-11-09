using System;
using MediatR;
using static PW.Application.Features.Auth.Login.LoginUserResponse;

namespace PW.Application.Features.Auth.Login;

public class LoginUserRequest : IRequest<LoginUserResponse>
    {
        public string UsernameOrEmail { get; set; }
        public string Password { get; set; }
    }
