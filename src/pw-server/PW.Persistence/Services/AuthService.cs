using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using PW.Application.Abstractions;
using PW.Domain.Entities;

namespace PW.Persistence.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<PWUser> _userManager;
    private readonly IConfiguration _configuration;

     public AuthService(UserManager<PWUser> userManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _configuration = configuration;
    }


    public async Task<string> LoginAsync(string email, string password)
    {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, password))
            {
                return string.Empty;
            }

            var token = await GenerateJwtToken(user);

        return token;
    }

    public async Task<string> RegisterAsync(string email, string password)
    {
         var existingUser = await _userManager.FindByEmailAsync(email);
            if (existingUser != null)
            {
                return string.Empty;
            }

            var user = new PWUser
            {
                UserName = email,
                Email = email,
            };

            var result = await _userManager.CreateAsync(user, password);

            if (!result.Succeeded)
            {
            return string.Empty;
            }

            var token = await GenerateJwtToken(user);
        return token;
    }

    public async Task<string> GenerateJwtToken(PWUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty)
            };

            var keyString = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(keyString))
                throw new InvalidOperationException("Jwt:Key is not configured.");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );

            return await Task.FromResult(new JwtSecurityTokenHandler().WriteToken(token));
        }

}
