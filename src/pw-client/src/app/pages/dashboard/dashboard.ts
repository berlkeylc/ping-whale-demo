import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { MonitoringService } from '../../core/services/monitoring.service';
import { MonitorClientModel } from '../../core/models/MonitorClientModel';
import { ApexAxisChartSeries, ApexChart, ApexStroke, ApexTitleSubtitle, ApexFill, NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Monitoring } from '../../core/models/Monitoring';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, RouterModule],
  templateUrl:"dashboard.html",
  styleUrls:["dashboard.scss"]
})
export class DashboardComponent implements OnInit {
  monitorings: Monitoring[] = [];
  
  constructor(
    private auth: AuthService,
    private monitoringService: MonitoringService
  ) {}

  async ngOnInit() {
    try {
      const response = await this.monitoringService.get();
      if (response && response.monitors) {
        response.monitors.forEach(monitor => {
          const monitoring: Monitoring = {
            ...monitor,
            uptimeChart: this.chart(`${monitor.upTime.toFixed(2)} %`, 'Uptime', monitor.upTimes),
            loadtimeChart: this.chart(`${monitor.loadTime.toFixed(2)} ms`, 'Load Time', monitor.loadTimes)
          };
          this.monitorings.push(monitoring);
        });
      }
    } catch (error) {
      console.error('Error fetching monitorings:', error);
      this.loadMockData();
    }
  }

  private loadMockData() {
    const mockMonitors: Partial<MonitorClientModel>[] = [
      {
        monitorId: '1',
        name: 'Server A',
        url: 'https://server-a.com',
        stepStatus: 'up',
        stepStatusText: 'Online',
        upTime: 99.5,
        loadTime: 250,
        upTimes: [99, 98, 100, 99.5],
        loadTimes: [220, 240, 250, 260],
        createdDate: new Date().toISOString(),
        monitorStatus: 'active',
        testStatus: 'passed',
        downTime: 0,
        downTimePercent: 0,
        totalMonitoredTime: 86400
      },
      {
        monitorId: '2',
        name: 'API Gateway',
        url: 'https://api.example.com',
        stepStatus: 'down',
        stepStatusText: 'Offline',
        upTime: 75.3,
        loadTime: 500,
        upTimes: [95, 90, 80, 75],
        loadTimes: [400, 450, 480, 500],
        createdDate: new Date().toISOString(),
        monitorStatus: 'active',
        testStatus: 'failed',
        downTime: 21600,
        downTimePercent: 24.7,
        totalMonitoredTime: 86400
      }
    ];

    mockMonitors.forEach(item => {
      if (item.upTime !== undefined && item.upTimes && item.loadTime !== undefined && item.loadTimes) {
        const monitoring: Monitoring = {
          ...item as MonitorClientModel,
          uptimeChart: this.chart(`${item.upTime.toFixed(2)} %`, 'Uptime', item.upTimes),
          loadtimeChart: this.chart(`${item.loadTime.toFixed(2)} ms`, 'Load Time', item.loadTimes)
        };
        this.monitorings.push(monitoring);
      }
    });
  }

  chart(title: string, subtitle: string, data: number[]) {
    return {
      chart: { type: 'area', height: 160, sparkline: { enabled: true } } as ApexChart,
      stroke: { curve: 'straight' } as ApexStroke,
      fill: { opacity: 0.3 } as ApexFill,
      series: [{ name: subtitle, data }] as ApexAxisChartSeries,
      yaxis: { min: 0 },
      colors: ['#DCE6EC'],
      title: {
        text: title,
        offsetX: 0,
        style: { fontSize: '16pt' }
      } as ApexTitleSubtitle,
      subtitle: {
        text: subtitle,
        offsetX: 0,
        style: { fontSize: '10pt' }
      } as ApexTitleSubtitle
    };
  }

  logout() {
    this.auth.logout();
  }
}
