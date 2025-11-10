using System;
using System.ComponentModel.DataAnnotations;
using MediatR;
using PW.Application.DTOS;

namespace PW.Application.Features.Monitoring.SaveMonitor
{
    public class SaveMonitorRequest : IRequest<SaveMonitorResponse>
    {
        public Guid Id { get; set; }
        
        [Required(ErrorMessage = "Project name is required")]
        [MaxLength(25, ErrorMessage = "Project name must be maximum 25 characters")]
        public string Name { get; set; }
        
        [Required(ErrorMessage = "Project URL is required")]
        [RegularExpression(@"^(https?:\/\/)?([\da-zA-Z\.-]+)\.([a-zA-Z\.]{2,6})([\/\w \.-]*)*\/?$", 
            ErrorMessage = "Please enter a valid URL (e.g., https://example.com)")]
        public required string Url { get; set; }
    }

    public class SaveMonitorResponse
    {
        public Guid Id { get; set; }
    }
}