using System.ComponentModel.DataAnnotations;
using static PW.Domain.Entities.PWMonitorStep;

namespace PW.Domain.Entities
{
    public class PWMonitorStepLog
    {
        [Key]
        public Guid MonitorStepLogId { get; set; }
        public Guid MonitorStepId { get; set; }
        public Guid MonitorId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public PWMonitorStepStatusTypes Status { get; set; }
        public string Log { get; set; }
        public int Interval { get; set; }
    }
}
