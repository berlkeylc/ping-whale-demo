using System;

namespace PW.Application.Features.Auth.Login;

    public class LoginUserResponse
    {
       
    }
    public class LoginUserSuccessResponse : LoginUserResponse
    {
        public string Token { get; set; }
    }
    public class LoginUserErrorResponse : LoginUserResponse
    {
        public string Message { get; set; }
    }
