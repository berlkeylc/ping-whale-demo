using System;
using PW.Domain.Entities;

namespace PW.Application.Abstractions;

    public interface IAuthService
    {
        Task<string> RegisterAsync(string email, string password);
        Task<string> LoginAsync(string email, string password);
        Task<string> GenerateJwtToken(PWUser user);
        Guid? UserId { get; }
    }
