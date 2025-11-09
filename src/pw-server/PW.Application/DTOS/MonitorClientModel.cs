using System;

namespace PW.Application.DTOS;

 public class MonitorClientModel
    {
        public Guid MonitorId { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? LastCheckDate { get; set; }
        public string MonitorStatus { get; set; }
        public string Name { get; set; }
        public string TestStatus { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string Url { get; set; }

        public double UpTime { get; set; }
        public List<double> UpTimes { get; set; }
        public double DownTime { get; set; }
        public double DownTimePercent { get; set; }
        public double LoadTime { get; set; }
        public List<double> LoadTimes { get; set; }
        public int TotalMonitoredTime { get; set; }
        public string StepStatus { get; set; }
        public string StepStatusText { get; set; }
    }
