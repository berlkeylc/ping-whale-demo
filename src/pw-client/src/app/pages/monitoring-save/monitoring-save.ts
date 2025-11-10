import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MonitoringService } from '../../core/services/monitoring.service';
import { SaveMonitorRequest } from '../../core/models/SaveMonitorRequest';



@Component({
  selector: 'app-monitoring-save',
  imports: [CommonModule, FormsModule],
  templateUrl: './monitoring-save.html',
  styleUrl: './monitoring-save.scss',
})
export class MonitoringSave implements OnInit {
  model: SaveMonitorRequest = { name: '', url: '' };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private monitoringService: MonitoringService
  ) {}

  get title(): string {
    const id = this.route.snapshot.queryParams['id'];
    return id ? (this.model.name || 'Edit Monitoring') : 'New Monitoring';
  }

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.queryParams['id'];
    if (id) {
      try {
        const response = await this.monitoringService.getById(id);
        if (response && response.monitors && response.monitors.length > 0) {
          const monitor = response.monitors[0];
          this.model = {
            id: monitor.monitorId,
            name: monitor.name,
            url: monitor.url
          };
        }
      } catch (error) {
        console.error('Error fetching monitor:', error);
      }
    } 
  }

  async save(): Promise<void> {
    try {
      const result = await this.monitoringService.save(this.model);
      if (result && result.id) {
        this.router.navigate(['dashboard']);
      }
    } catch (error) {
      console.error('Error saving monitor:', error);
    }
  }

}
