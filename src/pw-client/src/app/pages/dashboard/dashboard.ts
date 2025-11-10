import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { MonitoringService } from '../../core/services/monitoring.service';
import { ApexAxisChartSeries, ApexChart, ApexStroke, ApexTitleSubtitle, ApexFill, NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
    private monitoringService: MonitoringService,
    private router: Router
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
    }
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

  editMonitor(monitorId: string, event: Event): void {
    event.stopPropagation(); // Card'ın routerLink'inin tetiklenmesini engelle
    this.router.navigate(['/monitoring-save'], {
      queryParams: { id: monitorId }
    });
  }

  logout() {
    this.auth.logout();
  }
}
