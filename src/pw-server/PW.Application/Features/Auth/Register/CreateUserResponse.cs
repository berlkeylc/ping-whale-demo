using System;

namespace PW.Application.Features.Auth.Register;

public class CreateUserResponse
{
  public bool Succeeded { get; set; }
        public string Message { get; set; }
}
