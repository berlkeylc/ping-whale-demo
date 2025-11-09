using System;
using MediatR;
using PW.Application.Abstractions;
using static PW.Application.Features.Auth.Login.LoginUserResponse;

namespace PW.Application.Features.Auth.Login;

public class LoginUserHandler : IRequestHandler<LoginUserRequest, LoginUserResponse>
    {
        readonly IAuthService _authService;
        public LoginUserHandler(IAuthService authService)
        {
            _authService = authService;
        }

        public async Task<LoginUserResponse> Handle(LoginUserRequest request, CancellationToken cancellationToken)
        {
            var token = await _authService.LoginAsync(request.UsernameOrEmail, request.Password);
            return new LoginUserSuccessResponse()
            {
                Token = token
            };
        }
}
