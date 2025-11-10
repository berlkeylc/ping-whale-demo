import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MonitoringService } from '../../core/services/monitoring.service';
import { SaveMonitorRequest } from '../../core/models/SaveMonitorRequest';
import { SpinnerService } from '../../core/services/spinner.service';



@Component({
  selector: 'app-monitoring-save',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './monitoring-save.html',
  styleUrl: './monitoring-save.scss',
})
export class MonitoringSave implements OnInit {
  form!: FormGroup;
  model: SaveMonitorRequest = { name: '', url: '' };

  // URL pattern validator - supports http, https, and common URL formats
  private urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private monitoringService: MonitoringService,
    private spinnerService: SpinnerService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(25)]],
      url: ['', [Validators.required, Validators.pattern(this.urlPattern)]]
    });
  }

  get isEditMode(): boolean {
    return !!this.model.id;
  }

  get title(): string {
    const id = this.route.snapshot.queryParams['id'];
    return id ? (this.model.name || 'Edit Monitoring') : 'New Monitoring';
  }

  get nameError(): string {
    const nameControl = this.form.get('name');
    if (nameControl?.hasError('required') && nameControl?.touched) {
      return 'Project name is required';
    }
    if (nameControl?.hasError('maxlength') && nameControl?.touched) {
      return 'Project name must be maximum 25 characters';
    }
    return '';
  }

  get urlError(): string {
    const urlControl = this.form.get('url');
    if (urlControl?.hasError('required') && urlControl?.touched) {
      return 'Project URL is required';
    }
    if (urlControl?.hasError('pattern') && urlControl?.touched) {
      return 'Please enter a valid URL (e.g., https://example.com)';
    }
    return '';
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
          this.form.patchValue({
            name: monitor.name,
            url: monitor.url
          });
          if (this.isEditMode) {
            this.form.get('url')?.disable();
          }
        }
      } catch (error) {
        console.error('Error fetching monitor:', error);
      }
    } 
  }

  async save(): Promise<void> {
    this.form.markAllAsTouched();
    
    if (this.form.invalid) {
      return;
    }

    const formValue = { ...this.form.value };
    if (this.form.get('url')?.disabled) {
      formValue.url = this.model.url; 
    }

    this.model = {
      ...this.model,
      name: formValue.name,
      url: formValue.url
    };

    try {
      const result = await this.monitoringService.save(this.model);
      this.spinnerService.show();
      await new Promise(resolve => setTimeout(resolve, 500)); 
      this.spinnerService.hide();
      if (result && result.id) {
        this.router.navigate(['dashboard']);
      }
    } catch (error) {
      console.error('Error saving monitor:', error);
    }
  }

  cancel(): void {
    this.router.navigate(['dashboard']);
  }

}
