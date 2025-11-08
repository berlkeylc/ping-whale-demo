using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace AuthApi.Data.Entities
{
    public class PWMonitorStep
    {
        [Key]
        public Guid MonitorStepId { get; set; }
        public Guid MonitorId { get; set; }
        public PWMonitorStepTypes Type { get; set; }
        public string Settings { get; set; }
        public int Interval { get; set; }
        public PWMonitorStepStatusTypes Status { get; set; }
        public DateTime LastCheckDate { get; set; }

        public PWSMonitorStepSettingsRequest SettingsAsRequest()
        {
            return JsonSerializer.Deserialize<PWSMonitorStepSettingsRequest>(Settings);
        }

        public enum PWMonitorStepStatusTypes : short
        {
            Unknown = 0,
            Pending = 1,
            Processing = 2,
            Success = 3,
            Warning = 4,
            Fail = 5,
            Error = 6
        }

        public enum PWMonitorStepTypes : short
        {
            Unknown = 0,
            Request = 1,
            StatusCode = 2,
            HeaderExists = 3,
            BodyContains = 4,
        }

        public class PWSMonitorStepSettingsRequest
        {
            public string Url { get; set; }
        }
    }
}
