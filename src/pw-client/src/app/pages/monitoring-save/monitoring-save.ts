import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MonitoringService } from '../../core/services/monitoring.service';

interface SubscriptionFeature {
  name: string;
  valueRemained: number;
}

interface Subscription {
  features: SubscriptionFeature[];
}

interface SaveMonitorRequest {
  Id?: number;
  Name: string;
  Url: string;
}

@Component({
  selector: 'app-monitoring-save',
  imports: [CommonModule, FormsModule],
  templateUrl: './monitoring-save.html',
  styleUrl: './monitoring-save.scss',
})
export class MonitoringSave implements OnInit {

   loading = true;
  model: SaveMonitorRequest = { Name: '', Url: '' };
  subscription: Subscription | null = null;
  noquota = false;
  feature: SubscriptionFeature | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private monitoringService: MonitoringService
  ) {}

  get title(): string {
    return this.route.snapshot.params['id'] ? this.model.Name : 'New Monitoring';
  }

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.params['id'];
    if (id) {
          // Dummy service call
      const result = await this.fakeGetMonitoring(id);
      this.loading = false;
      if (result.success) {
        this.model.Name = result.data.name;
        this.model.Url = result.data.url;
      }
    } else {
      this.loading = false;
      // Dummy service call
      this.subscription = await this.fakeGetSubscription();
      this.feature = this.subscription.features.find(f => f.name === 'MONITOR') || null;

      if (this.feature) {
        const valueRemained = parseInt(this.feature.valueRemained.toString(), 10);
        this.noquota = !valueRemained || valueRemained <= 0;
      }
    }
  }

  async save(): Promise<void> {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.model.Id = +id;
    }
  
    const result = await this.monitoringService.save(this.model);
    if (result) {
      this.router.navigate(['dashboard']);
    }
  }

  // Dummy Service Methods
  private async fakeGetMonitoring(id: number) {
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
   // Dummy Service Methods

}
