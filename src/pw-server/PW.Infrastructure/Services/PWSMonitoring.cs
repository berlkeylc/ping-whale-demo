using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using PW.Domain.Entities;
using PW.Persistence.Context;
using static PW.Domain.Entities.PWMonitorStep;

namespace PW.Infrastructure.Services;

public class PWSMonitoring : IHostedService, IDisposable
    {
        public IServiceProvider Services { get; }
        private CancellationToken _token;

        public PWSMonitoring(IServiceProvider services)
        {
            Services = services;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _token = cancellationToken;
            DoWork();
            return Task.CompletedTask;
        }

        private async void DoWork()
        {
            while (true)
            {
                using (var scope = Services.CreateScope())
                {
                    var db = scope.ServiceProvider.GetRequiredService<PWDbContext>();
                    var steps = await db.MonitorSteps
                                        .Where(x =>
                                            x.Type == PWMonitorStepTypes.Request && x.Status != PWMonitorStepStatusTypes.Processing &&
                                            DateTime.UtcNow > x.LastCheckDate.AddSeconds(x.Interval)
                                        )
                                        .OrderBy(x => x.LastCheckDate)
                                        .Take(20)
                                        .ToListAsync();

                    foreach (var step in steps)
                    {
                        var settings = step.SettingsAsRequest();
                        if (!string.IsNullOrEmpty(settings.Url))
                        {
                            var log = new PWMonitorStepLog
                            {
                                MonitorId = step.MonitorId,
                                MonitorStepId = step.MonitorStepId,
                                StartDate = DateTime.UtcNow,
                                Interval = step.Interval,
                                Log = string.Empty,
                                Status = PWMonitorStepStatusTypes.Processing
                            };
                            db.Add(log);
                            await db.SaveChangesAsync(_token);

                            try
                            {
                                var client = new HttpClient();
                                client.Timeout = TimeSpan.FromSeconds(15);
                                var result = await client.GetAsync(settings.Url, _token);
                                if (result.IsSuccessStatusCode)
                                {
                                    log.Status = PWMonitorStepStatusTypes.Success;
                                }
                                else
                                {
                                    log.Status = PWMonitorStepStatusTypes.Fail;
                                }
                            }
                            catch (HttpRequestException rex)
                            {
                                log.Log = rex.Message;
                                log.Status = PWMonitorStepStatusTypes.Fail;
                            }
                            catch (Exception ex)
                            {
                                log.Log = ex.Message;
                                log.Status = PWMonitorStepStatusTypes.Error;
                            }
                            finally
                            {
                                log.EndDate = DateTime.UtcNow;
                            }

                            if (log.Status == PWMonitorStepStatusTypes.Success)
                                step.Status = PWMonitorStepStatusTypes.Success;
                            else if (log.Status == PWMonitorStepStatusTypes.Error)
                                step.Status = PWMonitorStepStatusTypes.Error;
                            else
                                step.Status = PWMonitorStepStatusTypes.Fail;
                        }
                        step.LastCheckDate = DateTime.UtcNow;
                        await db.SaveChangesAsync(_token);
                    }
                }
                await Task.Delay(500, _token);
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            // 
        }
    }
