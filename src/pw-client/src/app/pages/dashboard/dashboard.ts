import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { MonitoringService } from '../../core/services/monitoring.service';
import { ApexAxisChartSeries, ApexChart, ApexStroke, ApexTitleSubtitle, ApexFill, NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface Monitoring {
  monitorId: number;
  name: string;
  url: string;
  stepStatus: string;
  stepStatusText: string;
  upTime: number;
  loadTime: number;
  upTimes: number[];
  loadTimes: number[];
  uptimeChart?: any;
  loadtimeChart?: any;
}

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
      if (response) {
        const monitorings = response.monitors;
        monitorings.forEach(item => {
          item.uptimeChart = this.chart(`${item.upTime.toFixed(2)} %`, 'Uptime', item.upTimes);
          item.loadtimeChart = this.chart(`${item.loadTime.toFixed(2)} ms`, 'Load Time', item.loadTimes);
          this.monitorings.push(item as Monitoring);
        });
      }
    } catch (error) {
      console.error('Error fetching monitorings:', error);
      this.loadMockData();
    }
  }

  private loadMockData() {
    const result: Partial<Monitoring>[] = [
      {
        monitorId: 1,
        name: 'Server A',
        url: 'https://server-a.com',
        stepStatus: 'up',
        stepStatusText: 'Online',
        upTime: 99.5,
        loadTime: 250,
        upTimes: [99, 98, 100, 99.5],
        loadTimes: [220, 240, 250, 260]
      },
      {
        monitorId: 2,
        name: 'API Gateway',
        url: 'https://api.example.com',
        stepStatus: 'down',
        stepStatusText: 'Offline',
        upTime: 75.3,
        loadTime: 500,
        upTimes: [95, 90, 80, 75],
        loadTimes: [400, 450, 480, 500]
      }
    ];

    result.forEach(item => {
      item.uptimeChart = this.chart(`${item.upTime.toFixed(2)} %`, 'Uptime', item.upTimes);
      item.loadtimeChart = this.chart(`${item.loadTime.toFixed(2)} ms`, 'Load Time', item.loadTimes);
      this.monitorings.push(item as Monitoring);
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
