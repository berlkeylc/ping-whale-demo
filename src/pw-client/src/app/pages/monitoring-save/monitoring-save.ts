import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MonitoringService } from '../../core/services/monitoring.service';
import { SaveMonitorRequest } from '../../core/models/SaveMonitorRequest';

interface SubscriptionFeature {
  name: string;
  valueRemained: number;
}

interface Subscription {
  features: SubscriptionFeature[];
}

@Component({
  selector: 'app-monitoring-save',
  imports: [CommonModule, FormsModule],
  templateUrl: './monitoring-save.html',
  styleUrl: './monitoring-save.scss',
})
export class MonitoringSave implements OnInit {
  loading = true;
  model: SaveMonitorRequest = { name: '', url: '' };
  subscription: Subscription | null = null;
  noquota = false;
  feature: SubscriptionFeature | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private monitoringService: MonitoringService
  ) {}

  get title(): string {
    return this.route.snapshot.params['id'] ? this.model.name : 'New Monitoring';
  }

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.params['id'];
    if (id) {
      try {
        // Real service call to fetch monitor details
        const response = await this.monitoringService.getById(id);
        this.loading = false;
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
        this.loading = false;
        // Fallback to dummy data if service fails
        const result = await this.fakeGetMonitoring(id);
        if (result.success) {
          this.model.name = result.data.name;
          this.model.url = result.data.url;
        }
      }
    } else {
      this.loading = false;
      // Dummy service call for subscription (can be replaced with real service later)
      this.subscription = await this.fakeGetSubscription();
      this.feature = this.subscription.features.find(f => f.name === 'MONITOR') || null;

      if (this.feature) {
        const valueRemained = parseInt(this.feature.valueRemained.toString(), 10);
        this.noquota = !valueRemained || valueRemained <= 0;
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

  // Dummy Service Methods (can be removed when real services are available)
  private async fakeGetMonitoring(id: string) {
    return {
      success: true,
      data: { id, name: 'Demo Project', url: 'https://example.com' }
    };
  }

  private async fakeGetSubscription() {
    return {
      features: [{ name: 'MONITOR', valueRemained: 2 }]
    };
  }
}
