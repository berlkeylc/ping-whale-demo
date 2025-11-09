using System;
using MediatR;
using PW.Application.Abstractions;

namespace PW.Application.Features.Auth.Register;

public class CreateUserHandler : IRequestHandler<CreateUserRequest, CreateUserResponse>
    {
        readonly IAuthService _userService;
        public CreateUserHandler(IAuthService userService)
        {
            _userService = userService;
        }

        public async Task<CreateUserResponse> Handle(CreateUserRequest request, CancellationToken cancellationToken)
        {
        CreateUserResponse response = new CreateUserResponse();
        string token =  await _userService.RegisterAsync(request.Email, request.Password);

            return new()
            {
                Message = token,
                Succeeded = true,
            };

            //throw new UserCreateFailedException();
        }
    }