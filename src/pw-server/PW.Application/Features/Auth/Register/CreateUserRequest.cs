using System;
using MediatR;

namespace PW.Application.Features.Auth.Register;

public class CreateUserRequest : IRequest<CreateUserResponse>
    {
        public string NameSurname { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string PasswordConfirm { get; set; }
    }
