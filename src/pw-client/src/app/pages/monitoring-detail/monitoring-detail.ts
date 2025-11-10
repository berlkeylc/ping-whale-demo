import { Component, OnInit } from '@angular/core';
import { MonitoringService } from '../../core/services/monitoring.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';

interface Monitoring {
  monitorId: string;
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
  selector: 'app-monitoring-detail',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './monitoring-detail.html',
  styleUrl: './monitoring-detail.scss',
})
export class MonitoringDetail implements OnInit {
  monitoring: Monitoring | null = null;

  constructor(
    private route: ActivatedRoute,
    private monitoringService: MonitoringService
  ) {}

  async ngOnInit() {
    const monitorId = this.route.snapshot.params['monitorId'];
    try {
      const response = await this.monitoringService.getById(monitorId);
      if (response) {
        this.monitoring = response.monitors[0];
        this.setupCharts();
      }
    } catch (error) {
      console.error('Error fetching monitoring details:', error);
    }
  }

  private setupCharts() {
    if (this.monitoring) {
      this.monitoring.uptimeChart = this.createChart(
        `${this.monitoring.upTime.toFixed(2)} %`,
        'Uptime',
        this.monitoring.upTimes
      );
      
      this.monitoring.loadtimeChart = this.createChart(
        `${this.monitoring.loadTime.toFixed(2)} ms`,
        'Load Time',
        this.monitoring.loadTimes
      );
    }
  }

  private createChart(value: string, label: string, data: number[]) {
    return {
      series: [{
        name: label,
        data: data
      }],
      chart: {
        type: 'area',
        height: 140,
        sparkline: {
          enabled: true
        },
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      fill: {
        opacity: 0.3
      },
      title: {
        text: value,
        offsetX: 0,
        style: {
          fontSize: '24px'
        }
      },
      subtitle: {
        text: label,
        offsetX: 0,
        style: {
          fontSize: '14px'
        }
      }
    };
  }
}