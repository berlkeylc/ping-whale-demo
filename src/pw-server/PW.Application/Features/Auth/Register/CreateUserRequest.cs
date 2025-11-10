using System;
using MediatR;

namespace PW.Application.Features.Auth.Register;

public class CreateUserRequest : IRequest<CreateUserResponse>
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
