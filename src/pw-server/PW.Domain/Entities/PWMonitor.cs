using System.ComponentModel.DataAnnotations;

namespace PW.Domain.Entities
{
    public class PWMonitor
    {
        [Key]
        public Guid MonitorId { get; set; }
        public Guid UserId { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string Name { get; set; }
        public PWMonitorStatusTypes MonitorStatus { get; set; }
        public PWTestStatusTypes TestStatus { get; set; }
        public DateTime LastCheckDate { get; set; }
        public decimal UpTime { get; set; }
        public int LoadTime { get; set; }
        public int MonitorTime { get; set; }
    }

    public enum PWMonitorStatusTypes : short
    {
        Unknown = 0,
        Up = 1,
        Down = 2,
        Warning = 3
    }

    public enum PWTestStatusTypes : short
    {
        Unkown = 0,
        AllPassed = 1,
        Fail = 2,
        Warning = 3,
    }
}
